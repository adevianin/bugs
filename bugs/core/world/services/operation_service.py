from core.world.utils.point import Point
from core.world.entities.operation.build_new_town_operation import BuildNewTownOperation
from core.world.map import Map
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.town.town_factory import TownFactory

class OperationService():

    def __init__(self, map: Map, town_factory: TownFactory):
        self._map = map
        self._town_factory = town_factory

    def build_new_town(self, user_id: int,  position: Point):
        queens = self._map.get_ants_owned_by(user_id, AntTypes.QUEEN)
        workers = self._map.get_ants_owned_by(user_id, AntTypes.WORKER)
        new_town = self._town_factory.build_new_town(position, user_id)

        if len(queens) == 0:
            raise Exception('there is not queen')
        
        if len(workers) == 0:
            raise Exception('there is not workers')
        
        queen = queens[0]
        worker = workers[0]

        operation = BuildNewTownOperation.build_build_new_town_operation(position, queen, worker, new_town)
        operation.start_operation()
        