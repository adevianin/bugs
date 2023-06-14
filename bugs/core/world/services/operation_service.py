from core.world.utils.point import Point
from core.world.entities.colony.operation.build_new_nest_operation import BuildNewNestOperation
from core.world.map import Map
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest_factory import NestFactory

class OperationService():

    def __init__(self, map: Map, nest_factory: NestFactory):
        self._map = map
        self._nest_factory = nest_factory

    def build_new_nest(self, user_id: int,  position: Point):
        queens = self._map.get_ants_owned_by(user_id, AntTypes.QUEEN)
        workers = self._map.get_ants_owned_by(user_id, AntTypes.WORKER)
        new_nest = self._nest_factory.build_new_nest(position, user_id)

        if len(queens) == 0:
            raise Exception('there is not queen')
        
        if len(workers) == 0:
            raise Exception('there is not workers')
        
        queen = queens[0]
        worker = workers[0]

        operation = BuildNewNestOperation.build_build_new_nest_operation(position, queen, worker, new_nest)
        operation.start_operation()
        