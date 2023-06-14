from core.world.map import Map
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.world_factory import WorldFactory
from core.world.entities.ant.base.larva import Larva
from core.world.entities.nest.nest import Nest
from core.world.world import World

class NestService():

    def __init__(self, map: Map, world: World, world_factory: WorldFactory):
        self._map = map
        self._world = world
        self._world_factory = world_factory

    def add_larva(self, nest_id: int, user_id: int, larva_type: AntTypes):
        colony = self._world.get_colony_owned_by_user(user_id)
        nest = colony.get_nest_by_id(nest_id)

        if (not nest):
            raise Exception(f'nest id = {nest_id} is not found in users colony')

        queen = colony.get_queen()

        if (queen.located_in_nest_id != nest_id):
            raise Exception('queen is not in nest')

        larva = Larva.build_larva(nest.position, larva_type, queen.dna_profile, 0)
        nest.add_larva(larva)
