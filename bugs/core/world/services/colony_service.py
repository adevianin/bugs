from .base_service import BaseService
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.utils.point import Point
from core.world.entities.item.items.base.item import Item 
from core.world.entities.item.items.base.item_types import ItemTypes 
from core.world.settings import NEW_EGG_FOOD_COST, LAY_EGG_SEASONS, MAX_DISTANCE_TO_SUB_NEST, MAX_SUB_NEST_COUNT, MAX_DISTANCE_TO_OPERATION_TARGET
from core.world.messages import Messages
from core.world.utils.remove_non_alphanumeric_and_spaces import remove_non_alphanumeric_and_spaces
from core.world.exceptions import GameRuleError, EntityNotFoundError

from typing import Callable

class ColonyService(BaseService):

    def __init__(self, event_bus, operation_factory: OperationFactory):
        super().__init__(event_bus)
        self._operation_factory = operation_factory

    def add_egg(self, user_id: int, nest_id: int, name: str, is_fertilized: bool):
        nest = self._find_nest_for_owner(nest_id, user_id)
        queen = self._find_queen_of_colony(nest.from_colony_id)
        
        if not queen or queen.located_in_nest_id != nest_id:
            return Messages.CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST
        
        if nest.stored_calories < NEW_EGG_FOOD_COST:
            return Messages.NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG
        
        if not self._world.current_season in LAY_EGG_SEASONS:
            return Messages.NOT_SUITABLE_SEASON_TO_LAY_EGG
        
        egg = queen.produce_egg(name, is_fertilized)
        nest.give_calories(NEW_EGG_FOOD_COST)
        nest.add_egg(egg)

    def change_egg_caste(self, user_id: int, nest_id: int, egg_id: int, ant_type: AntTypes):
        nest = self._find_nest_for_owner(nest_id, user_id)
        nest.change_egg_caste(egg_id, ant_type)

    def change_egg_name(self, user_id: int, nest_id: int, egg_id: int, name: str):
        nest = self._find_nest_for_owner(nest_id, user_id)
        nest.change_egg_name(egg_id, name)

    def move_egg_to_larva_chamber(self, user_id: int, nest_id: int, egg_id: int):
        nest = self._find_nest_for_owner(nest_id, user_id)
        nest.move_egg_to_larva_chamber(egg_id)

    def delete_egg(self, user_id: int, nest_id: int, egg_id: int):
        nest = self._find_nest_for_owner(nest_id, user_id)
        nest.delete_egg(egg_id)

    def delete_larva(self, user_id: int, nest_id: int, larva_id: int):
        nest = self._find_nest_for_owner(nest_id, user_id)
        nest.delete_larva(larva_id)

    def stop_operation(self, user_id: int, colony_id: int, operation_id: int):
        colony = self._find_ant_colony_for_owner(colony_id, user_id)
        colony.cancel_operation(operation_id)

    def build_new_sub_nest(self, user_id: int, performing_colony_id: int, position: Point, workers_count: int, warriors_count: int, nest_name: str):
        colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)
        queen = self._find_queen_of_colony(performing_colony_id)

        if not queen:
            return Messages.CANT_BUILD_SUB_NEST_WITHOUT_QUEEN
        
        if queen.position.dist(position) > MAX_DISTANCE_TO_SUB_NEST:
            return Messages.CANT_BUILD_SUB_NEST_FAR_AWAY
        
        sub_nest_filter: Callable[[Nest], bool] = lambda nest: not nest.is_main
        sub_nests = self._world.map.get_entities(colony.id, [EntityTypes.NEST], sub_nest_filter)

        if len(sub_nests) >= MAX_SUB_NEST_COUNT:
            return Messages.CANT_BUILD_MORE_SUB_NEST
        
        nest_name = remove_non_alphanumeric_and_spaces(nest_name)
        
        operation = self._operation_factory.build_build_new_sub_nest_operation(nest_name, position, workers_count, warriors_count)

        if not operation.validate():
            raise GameRuleError('operation build_new_sub_nest is not valid')
        
        colony.add_operation(operation)
        
    def destroy_nest_operation(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int, warriors_count: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)
        
        nest: Nest = self._world.map.get_entity_by_id(nest_id)
        if not nest:
            return Messages.NO_NEST_TO_DESTROY
        
        if nest.from_colony_id == performing_colony.id:
            raise GameRuleError(f'colony(id{performing_colony_id}) cant destroy its nest(id={nest.from_colony_id})')
        
        queen_of_colony = self._find_queen_of_colony(performing_colony.id)
        if not queen_of_colony:
            return Messages.CANT_DESTROY_NEST_WITHOUT_LIVING_QUEEN
        
        if queen_of_colony.position.dist(nest.position) > MAX_DISTANCE_TO_OPERATION_TARGET:
            return Messages.NEST_TO_DESTROY_IS_FAR_AWAY
        
        operation = self._operation_factory.build_destroy_nest_operation(nest, workers_count, warriors_count)

        if not operation.validate():
            raise GameRuleError('operation destroy_nest_operation is not valid')

        performing_colony.add_operation(operation)

    def pillage_nest_operation(self, user_id: int, performing_colony_id: int, nest_to_pillage_id: int, nest_for_loot_id: int, workers_count: int, warriors_count: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)

        nest_to_pillage = self._world.map.get_entity_by_id(nest_to_pillage_id)
        if not nest_to_pillage:
            return Messages.NO_NEST_TO_PILLAGE

        nest_for_loot = self._world.map.get_entity_by_id(nest_for_loot_id)
        if not nest_for_loot:
            return Messages.CANT_PILLAGE_WITHOUT_NEST_FOR_LOOT

        if nest_to_pillage.from_colony_id == performing_colony.id:
            raise GameRuleError(f'colony(id={performing_colony_id}) cant pillage its nest(id={nest_to_pillage_id})')
        
        if nest_for_loot.from_colony_id != performing_colony.id:
            raise GameRuleError('nest for loot can be only from performing colony')
        
        queen_of_colony = self._find_queen_of_colony(performing_colony.id)
        if not queen_of_colony:
            return Messages.CANT_PILLAGE_NEST_WITHOUT_LIVING_QUEEN
        
        if queen_of_colony.position.dist(nest_to_pillage.position) > MAX_DISTANCE_TO_OPERATION_TARGET:
            return Messages.NEST_TO_PILLAGE_IS_FAR_AWAY

        operation = self._operation_factory.build_pillage_nest_operation(nest_to_pillage, nest_for_loot, workers_count, warriors_count)

        if not operation.validate():
            raise GameRuleError('operation pillage_nest_operation is not valid')
        
        performing_colony.add_operation(operation)

    def transfer_food_operation(self, user_id: int, performing_colony_id: int, from_nest_id: int, to_nest_id: int, workers_count: int, warriors_count: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)
        
        from_nest: Nest = self._world.map.get_entity_by_id(from_nest_id)
        if not from_nest:
            raise EntityNotFoundError(f'nest(id={from_nest_id}) not found')
        
        if from_nest.from_colony_id != performing_colony_id:
            GameRuleError('cant transport food from another colony\'s nest')

        to_nest: Nest = self._world.map.get_entity_by_id(to_nest_id)
        if not to_nest:
            raise EntityNotFoundError(f'nest(id={to_nest_id}) not found')
        
        if to_nest.from_colony_id != performing_colony_id:
            GameRuleError('cant transport food to another colony\'s nest')

        if from_nest.id == to_nest.id:
            raise GameRuleError('cant transport food to same nest')
        
        operation = self._operation_factory.build_transport_food_operation(from_nest, to_nest, workers_count, warriors_count)

        if not operation.validate():
            raise GameRuleError('operation transfer_food_operation is not valid')

        performing_colony.add_operation(operation)

    def build_fortification_operation(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)
        nest = self._find_nest_for_owner(nest_id, user_id)
        
        operation = self._operation_factory.build_build_fortification(nest, workers_count)

        if not operation.validate():
            raise GameRuleError('operation build_fortification_operation is not valid')
        
        performing_colony.add_operation(operation)

    def bring_bug_operation(self, user_id: int, performing_colony_id: int, nest_id: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)
        nest = self._find_nest_for_owner(nest_id, user_id)
        
        filter: Callable[[Item], bool] = lambda item: item.item_type == ItemTypes.BUG_CORPSE
        items = self._world.map.find_entities_near(nest.position, nest.area, EntityTypes.ITEM, filter)

        if not items:
            return Messages.NO_BUG_CORPSE_IN_NEST_AREA
        
        operation = self._operation_factory.build_bring_bug_corpse_to_nest_operation(nest, items[0].position)

        if not operation.validate():
            raise GameRuleError('operation bring_bug_operation is not valid')

        performing_colony.add_operation(operation)

    def rename_nest(self, user_id: int, nest_id: int, name: str):
        nest = self._find_nest_for_owner(nest_id, user_id)
        nest.name = name

    def _find_queen_of_colony(self, colony_id: int) -> QueenAnt:
        colony_queen_filter: Callable[[QueenAnt], bool] = lambda ant: ant.is_queen_of_colony
        queens = self._world.map.get_entities(colony_id, [EntityTypes.ANT], colony_queen_filter)

        if len(queens) > 0:
            return queens[0]
        else:
            return None
    