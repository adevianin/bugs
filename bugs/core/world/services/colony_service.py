from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.world.world import World
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.utils.point import Point

class ColonyService():

    def __init__(self, operation_factory: OperationFactory):
        self._operation_factory = operation_factory

    def set_world(self, world: World):
        self._world = world

    def add_egg(self, user_id: int, nest_id: int, name: str, is_fertilized: bool):
        nest: Nest = self._world.map.get_entity_by_id(nest_id)
        colony = self._world.get_colony_by_id(nest.from_colony_id)

        if colony.member_type != EntityTypes.ANT:
            raise Exception('not corrent colony type')
        
        colony: AntColony

        if colony.owner_id != user_id:
            raise Exception(f'user dont have this colony')
        
        queen: QueenAnt = self._world.map.get_entity_by_id(colony.queen_id)

        if queen.located_in_nest_id != nest_id:
            raise Exception('queen is not in nest')
        
        if len(name) < 3:
            raise Exception('invalid name')
        
        egg = queen.produce_egg(name, is_fertilized)
        nest.add_egg(egg)

    def change_egg_caste(self, user_id: int, nest_id: int, egg_id: str, ant_type: AntTypes):
        nest: Nest = self._world.map.get_entity_by_id(nest_id)

        if nest.owner_id != user_id:
            raise Exception(f'user dont have this nest')
        
        nest.change_egg_caste(egg_id, ant_type)

    def stop_operation(self, user_id: int, colony_id: int, operation_id: int):
        colony: AntColony = self._world.get_colony_by_id(colony_id)
        
        if colony.owner_id != user_id:
            raise Exception('user is not colony owner')
        
        colony.cancel_operation(operation_id)

    def build_new_sub_nest(self, user_id: int, performing_colony_id: int, position: Point, workers_count: int):
        colony: AntColony = self._world.get_colony_by_id(performing_colony_id)

        if colony.owner_id != user_id:
            raise Exception('user is not colony owner')

        operation = self._operation_factory.build_build_new_sub_nest_operation(building_site=position, workers_count=workers_count)
        colony.add_operation(operation)
        
    def destroy_nest_operation(self, user_id: int, performing_colony_id: int, nest_id: int, warriors_count: int):
        performing_colony: AntColony = self._world.get_colony_by_id(performing_colony_id)

        if performing_colony.owner_id != user_id:
            raise Exception('user is not colony owner')
        
        nest: Nest = self._world.map.get_entity_by_id(nest_id)

        if nest.from_colony_id != performing_colony.id:
            operation = self._operation_factory.build_destroy_nest_operation(nest, warriors_count)
            performing_colony.add_operation(operation)

    def pillage_nest_operation(self, user_id: int, performing_colony_id: int, nest_to_pillage_id: int, nest_for_loot_id: int, workers_count: int, warriors_count: int):
        performing_colony: AntColony = self._world.get_colony_by_id(performing_colony_id)

        if performing_colony.owner_id != user_id:
            raise Exception('user is not colony owner')

        nest_to_pillage = self._world.map.get_entity_by_id(nest_to_pillage_id)
        nest_for_loot = self._world.map.get_entity_by_id(nest_for_loot_id)

        if nest_to_pillage.from_colony_id != performing_colony.id and nest_for_loot.from_colony_id == performing_colony.id:
            operation = self._operation_factory.build_pillage_nest_operation(nest_to_pillage, nest_for_loot, workers_count, warriors_count)
            performing_colony.add_operation(operation)

    def transfer_food_operation(self, user_id: int, performing_colony_id: int, from_nest_id: int, to_nest_id: int, workers_count: int):
        performing_colony: AntColony = self._world.get_colony_by_id(performing_colony_id)

        if performing_colony.owner_id != user_id:
            raise Exception('user is not colony owner')
        
        from_nest = self._world.map.get_entity_by_id(from_nest_id)
        to_nest = self._world.map.get_entity_by_id(to_nest_id)

        if not from_nest or from_nest.owner_id != user_id:
            raise Exception('wrong nest id')
        
        if not to_nest or to_nest.owner_id != user_id:
            raise Exception('wrong nest id')
        
        if from_nest.id == to_nest.id:
            raise Exception('wrong nest id')
        
        operation = self._operation_factory.build_transport_food_operation(from_nest, to_nest, workers_count)
        performing_colony.add_operation(operation)

    