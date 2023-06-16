from core.world.utils.point import Point
from core.world.entities.world.world import World
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.colony.operation.operation_factory import OperationFactory

class ColonyService():

    def __init__(self, world: World, operation_factory: OperationFactory, nest_factory: NestFactory):
        self._world = world
        self._operation_factory = operation_factory
        self._nest_factory = nest_factory

    def build_new_nest(self, user_id: int, position: Point):
        colony = self._world.get_colony_owned_by_user(user_id)
        new_nest = self._nest_factory.build_new_nest(position, user_id)

        operation = self._operation_factory.build_build_new_nest_operation(position, new_nest)

        colony.add_operation(operation)
        