from .base_service import BaseService
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.utils.point import Point
from core.world.entities.item.items.base.item import Item 
from core.world.entities.item.items.base.item_types import ItemTypes 
from core.world.settings import (NEW_EGG_FOOD_COST, LAY_EGG_SEASONS, MAX_DISTANCE_TO_SUB_NEST, MAX_SUB_NEST_COUNT, 
                                 MAX_DISTANCE_TO_OPERATION_TARGET, FOOD_IN_NEW_COLONY_MAIN_NEST, ITEM_SOURCE_BLOCKING_RADIUS, NEST_BLOCKING_RADIUS)
from core.world.utils.clean_string import clean_string
from core.world.exceptions import GameRuleError, StateConflictError
from core.world.entities.ant.base.ant import Ant
from core.world.entities.action.colony_born_action import ColonyBornAction
from core.world.entities.colony.base.colony import Colony

from typing import Callable

class ColonyService(BaseService):

    def __init__(self, event_bus, colony_factory: ColonyFactory, operation_factory: OperationFactory):
        super().__init__(event_bus)
        self._colony_factory = colony_factory
        self._operation_factory = operation_factory

        self._event_bus.add_listener('colony_died', self._on_colony_died)

    def found_new_colony(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: Point, colony_name: str):
        ant: Ant = self._find_ant_for_owner(queen_id, user_id)
        if ant.ant_type != AntTypes.QUEEN:
            self._raise_state_conflict_error()
        queen: QueenAnt = ant

        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)
        male = nuptial_environment.pull_male(nuptial_male_id)
        if not male:
            self._raise_state_conflict_error()
        queen.fertilize(male)

        new_colony = self._colony_factory.build_new_ant_colony(user_id, self._world.map, self._world.colony_relations_table, colony_name)
        self._emit_action(ColonyBornAction.build(new_colony))
        new_colony.add_new_member(queen)

        def on_nest_found(nest: Nest):
            queen.relocate_to_nest(nest)
            queen.fly_nuptial_flight_back(nest.position)
            # queen.build_nest(nest, True)
            nest.take_calories(FOOD_IN_NEW_COLONY_MAIN_NEST)
            self._world.add_new_colony(new_colony)
            self._event_bus.emit('colony_born', new_colony)

        queen.found_nest(colony_name, True, nest_building_site, on_nest_found)

    def add_egg(self, user_id: int, nest_id: int, name: str, is_fertilized: bool):
        nest = self._find_nest_for_owner(nest_id, user_id)
        queen = self._find_queen_of_colony(nest.from_colony_id)
        
        if not queen or queen.located_in_nest_id != nest_id:
            self._raise_state_conflict_error()
        
        if nest.stored_calories < NEW_EGG_FOOD_COST:
            self._raise_state_conflict_error()
        
        if not self._world.current_season in LAY_EGG_SEASONS:
            self._raise_state_conflict_error()
        
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

    def rename_nest(self, user_id: int, nest_id: int, name: str):
        nest = self._find_nest_for_owner(nest_id, user_id)
        nest.name = name

    def stop_operation(self, user_id: int, colony_id: int, operation_id: int):
        colony = self._find_ant_colony_for_owner(colony_id, user_id)
        colony.cancel_operation(operation_id)

    def build_new_sub_nest(self, user_id: int, performing_colony_id: int, position: Point, workers_count: int, warriors_count: int, nest_name: str):
        colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)
        queen = self._find_queen_of_colony(performing_colony_id)

        if not queen:
            self._raise_state_conflict_error(f'not found queen of colony(id={performing_colony_id})')

        main_nest = self._find_main_nest_of_colony(performing_colony_id)
        if not main_nest:
            self._raise_state_conflict_error(f'not found main nest of colony(id={performing_colony_id})')
        
        if main_nest.position.dist(position) > MAX_DISTANCE_TO_SUB_NEST:
            raise GameRuleError('cant build subnest far away')
        
        sub_nest_filter: Callable[[Nest], bool] = lambda nest: not nest.is_main
        sub_nests = self._world.map.get_entities(colony.id, [EntityTypes.NEST], sub_nest_filter)

        if len(sub_nests) >= MAX_SUB_NEST_COUNT:
            self._raise_state_conflict_error(f'cant build more subnests for colony(id={performing_colony_id})')

        blocking_item_sources = self._world.map.find_entities_near(position, ITEM_SOURCE_BLOCKING_RADIUS, [EntityTypes.ITEM_SOURCE])
        
        if len(blocking_item_sources) > 0:
            raise GameRuleError('some item sources blocking building nest')

        blocking_nests = self._world.map.find_entities_near(position, NEST_BLOCKING_RADIUS, [EntityTypes.NEST])
        
        if len(blocking_nests) > 0:
            raise GameRuleError('some nests blocking building nest')
        
        nest_name = clean_string(nest_name)
        
        operation = self._operation_factory.build_build_new_sub_nest_operation(nest_name, position, workers_count, warriors_count)

        if not operation.validate():
            raise GameRuleError('operation build_new_sub_nest is not valid')
        
        colony.add_operation(operation)
        
    def destroy_nest_operation(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int, warriors_count: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)

        nest: Nest = self._world.map.find_entity_by_id(nest_id)
        if not nest:
            self._raise_state_conflict_error()
        
        if nest.from_colony_id == performing_colony.id:
            raise GameRuleError(f'colony(id{performing_colony_id}) cant destroy its nest(id={nest.from_colony_id})')
        
        queen_of_colony = self._find_queen_of_colony(performing_colony.id)
        if not queen_of_colony:
            self._raise_state_conflict_error()
        
        if queen_of_colony.position.dist(nest.position) > MAX_DISTANCE_TO_OPERATION_TARGET:
            raise GameRuleError('nest to destroy is far away')
        
        operation = self._operation_factory.build_destroy_nest_operation(nest, workers_count, warriors_count)

        if not operation.validate():
            raise GameRuleError('operation destroy_nest_operation is not valid')

        performing_colony.add_operation(operation)

    def pillage_nest_operation(self, user_id: int, performing_colony_id: int, nest_to_pillage_id: int, nest_for_loot_id: int, workers_count: int, warriors_count: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)

        nest_to_pillage = self._world.map.find_entity_by_id(nest_to_pillage_id)
        if not nest_to_pillage:
            self._raise_state_conflict_error()
        
        if nest_to_pillage.from_colony_id == performing_colony.id:
            raise GameRuleError(f'colony(id={performing_colony_id}) cant pillage its nest(id={nest_to_pillage_id})')

        nest_for_loot = self._world.map.find_entity_by_id(nest_for_loot_id)
        if not nest_for_loot:
            self._raise_state_conflict_error()

        if nest_for_loot.from_colony_id != performing_colony.id:
            raise GameRuleError('nest for loot can be only from performing colony')
        
        queen_of_colony = self._find_queen_of_colony(performing_colony.id)
        if not queen_of_colony:
            self._raise_state_conflict_error()
        
        if queen_of_colony.position.dist(nest_to_pillage.position) > MAX_DISTANCE_TO_OPERATION_TARGET:
            raise GameRuleError('nest to pillage is far away')
        
        operation = self._operation_factory.build_pillage_nest_operation(nest_to_pillage, nest_for_loot, workers_count, warriors_count)

        if not operation.validate():
            raise GameRuleError('operation pillage_nest_operation is not valid')
        
        performing_colony.add_operation(operation)

    def transport_food_operation(self, user_id: int, performing_colony_id: int, from_nest_id: int, to_nest_id: int, workers_count: int, warriors_count: int):
        performing_colony = self._find_ant_colony_for_owner(performing_colony_id, user_id)
        
        from_nest = self._find_nest_for_owner(from_nest_id, user_id)
        if from_nest.from_colony_id != performing_colony_id:
            GameRuleError('cant transport food from another colony\'s nest')

        to_nest = self._find_nest_for_owner(to_nest_id, user_id)
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
        
        filter: Callable[[Item], bool] = lambda item: item.item_type == ItemTypes.BUG_CORPSE and not item.is_bringing
        items = self._world.map.find_entities_near(nest.position, nest.area, [EntityTypes.ITEM], filter)
        key: Callable[[Item], int] = lambda item: nest.position.dist(item.position)
        items.sort(key = key)

        if len(items) == 0:
            self._raise_state_conflict_error()
        
        operation = self._operation_factory.build_bring_bug_corpse_to_nest_operation(nest, items[0].position)

        if not operation.validate():
            raise GameRuleError('operation bring_bug_operation is not valid')

        performing_colony.add_operation(operation)

    def _on_colony_died(self, colony: Colony):
        self._world.remove_colony(colony)
    