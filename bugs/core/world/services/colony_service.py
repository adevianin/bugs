from core.world.utils.point import Point
from core.world.entities.colony.operation.build_new_nest_operation import BuildNewNestOperation
from core.world.world import World
from core.world.entities.nest.nest_factory import NestFactory

class ColonyService():

    def __init__(self, world: World, nest_factory: NestFactory):
        self._world = world
        self._nest_factory = nest_factory

    def build_new_nest(self, user_id: int, position: Point):
        colony = self._world.get_colony_owned_by_user(user_id)
        new_nest = self._nest_factory.build_new_nest(position, user_id)

        operation = BuildNewNestOperation.build_build_new_nest_operation(position, new_nest)

        colony.add_operation(operation)
        