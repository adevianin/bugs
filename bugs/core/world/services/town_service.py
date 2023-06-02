from core.world.map import Map
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.world_factory import WorldFactory
from core.world.entities.ant.base.larva import Larva
from core.world.entities.town.town import Town

class TownService():

    def __init__(self, map: Map, world_factory: WorldFactory):
        self._map = map
        self._world_factory = world_factory

    def add_larva(self, town_id: int, user_id: int, larva_type: AntTypes):
        town = self._map.get_entity_by_id(town_id)
        queen = self._find_queen_in_town(town)

        if (not queen):
            raise Exception('queen is not in town')

        if (not town):
            raise Exception(f'town id = {town_id} is not found')
        
        if (town.owner_id != user_id):
            raise Exception('used does not own town')
        
        larva = Larva.build_larva(town.position, larva_type, queen.dna_profile, 0)
        town.add_larva(larva)

    def _find_queen_in_town(self, town: Town):
        entities = self._map.get_entities_from_town(town.id)
        for entity in entities:
            if entity.type == EntityTypes.ANT and entity.ant_type == AntTypes.QUEEN:
                return entity
        
        return None