from core.world.utils.point import Point
from core.world.entities.world.world import World
from core.world.entities.colony.operation.operation_factory import OperationFactory

class ColonyService():

    def __init__(self, operation_factory: OperationFactory):
        self._operation_factory = operation_factory

    def set_world(self, world: World):
        self._world = world

    def cancel_operation(self, user_id: int, operation_id: int):
        colony = self._world.get_colony_owned_by_user(user_id)
        colony.cancel_operation(operation_id)

    def build_new_nest(self, user_id: int, position: Point):
        colony = self._world.get_colony_owned_by_user(user_id)
        operation = self._operation_factory.build_build_new_nest_operation(building_site=position)
        colony.add_operation(operation)
        
    def destroy_nest_operation(self, user_id: int, nest_id: int):
        colony = self._world.get_colony_owned_by_user(user_id)
        nest = self._world.map.get_entity_by_id(nest_id)
        if nest.from_colony_id != colony.id:
            operation = self._operation_factory.build_destroy_nest_operation(nest=nest)
            colony.add_operation(operation)