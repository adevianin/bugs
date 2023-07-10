from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.larva import Larva
from core.world.entities.world.world import World

class NestService():

    def __init__(self):
        pass

    def set_world(self, world: World):
        self._world = world

    def add_larva(self, nest_id: int, user_id: int, larva_type: AntTypes):
        colony = self._world.get_colony_owned_by_user(user_id)
        nest = self._world.map.get_entity_by_id(nest_id)

        if (not nest or nest.from_colony != colony.id):
            raise Exception(f'nest id = {nest_id} is not found in users colony')

        queen_ants = self._world.map.get_ants_from_colony(colony.id, AntTypes.QUEEN)
        queen = queen_ants[0]

        if (queen.located_in_nest_id != nest_id):
            raise Exception('queen is not in nest')

        larva = Larva.build_larva(nest.position, larva_type, queen.dna_profile, 0)
        nest.add_larva(larva)
