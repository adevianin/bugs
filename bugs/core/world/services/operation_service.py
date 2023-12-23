from core.world.utils.point import Point
from core.world.entities.world.world import World
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony

class OperationService():

    def __init__(self, operation_factory: OperationFactory):
        self._operation_factory = operation_factory

    def set_world(self, world: World):
        self._world = world

    def stop_operation(self, user_id: int, colony_id: int, operation_id: int):
        colony: AntColony = self._world.get_colony_by_id(colony_id)
        
        if colony.owner_id != user_id:
            raise Exception('user is not colony owner')
        
        colony.cancel_operation(operation_id)

    def build_new_sub_nest(self, user_id: int, colony_id: int, position: Point, workers_count: int):
        colony: AntColony = self._world.get_colony_by_id(colony_id)

        if colony.owner_id != user_id:
            raise Exception('user is not colony owner')

        operation = self._operation_factory.build_build_new_sub_nest_operation(building_site=position, workers_count=workers_count)
        colony.add_operation(operation)
        
    # def destroy_nest_operation(self, user_id: int, nest_id: int):
    #     colony = self._world.get_colony_owned_by_user(user_id)
    #     nest = self._world.map.get_entity_by_id(nest_id)
    #     if nest.from_colony_id != colony.id:
    #         operation = self._operation_factory.build_destroy_nest_operation(nest=nest)
    #         colony.add_operation(operation)

    # def pillage_nest_operation(self, user_id: int, pillaging_nest_id: int, unload_nest_id: int):
    #     colony: AntColony = self._world.get_colony_owned_by_user(user_id)
    #     nest_to_pillage = self._world.map.get_entity_by_id(pillaging_nest_id)
    #     nest_to_unload = self._world.map.get_entity_by_id(unload_nest_id)
    #     if nest_to_pillage.from_colony_id != colony.id and nest_to_unload.from_colony_id == colony.id:
    #         operation = self._operation_factory.build_pillage_nest_operation(nest_to_pillage=nest_to_pillage, nest_to_unload=nest_to_unload)
    #         colony.add_operation(operation)