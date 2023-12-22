from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.world.world import World
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony

class NestService():

    def __init__(self):
        pass

    def set_world(self, world: World):
        self._world = world

    def add_larva(self, nest_id: int, user_id: int, ant_type: AntTypes):
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

        nest.add_larva(queen.produce_larva(ant_type))
