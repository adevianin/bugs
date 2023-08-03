from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.larva import Larva
from core.world.entities.world.world import World
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from typing import Callable

class NestService():

    def __init__(self):
        pass

    def set_world(self, world: World):
        self._world = world

    def add_larva(self, nest_id: int, user_id: int, ant_type: AntTypes):
        colony = self._world.get_colony_owned_by_user(user_id)
        nest: Nest = self._world.map.get_entity_by_id(nest_id)

        if (not nest or nest.from_colony != colony.id):
            raise Exception(f'nest id = {nest_id} is not found in users colony')

        queen_filter: Callable[[Ant], bool] = lambda ant: ant.ant_type ==  AntTypes.QUEEN and ant.located_in_nest_id == nest_id
        queen_ants = self._world.map.get_entities(from_colony_id=colony.id, entity_types=[EntityTypes.ANT], filter=queen_filter)

        if (len(queen_ants) == 0): 
            raise Exception('queen is not found')
        
        queen = queen_ants[0]

        larva = Larva.build_larva(ant_type, queen.dna_profile, 0)
        nest.add_larva(larva)
