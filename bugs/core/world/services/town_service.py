from core.world.world import World
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.world_factory import WorldFactory
from core.world.entities.ant.base.larva import Larva

class TownService():

    def __init__(self, world: World, world_factory: WorldFactory):
        self._world = world
        self._world_factory = world_factory

    def add_larva(self, town_id: int, user_id: int, larva_type: AntTypes):
        town = self._world.map.get_entity_by_id(town_id)

        if (not town):
            raise Exception(f'town id = {town_id} is not found')
        
        if (town.owner_id != user_id):
            raise Exception('used does not own town')
        
        larva = Larva.build_larva(town.position, larva_type, town.queen.dna_profile, 0)
        town.add_larva(larva)