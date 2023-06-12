from core.world.map import Map
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.world_factory import WorldFactory
from core.world.entities.ant.base.larva import Larva
from core.world.entities.nest.nest import Nest

class NestService():

    def __init__(self, map: Map, world_factory: WorldFactory):
        self._map = map
        self._world_factory = world_factory

    def add_larva(self, nest_id: int, user_id: int, larva_type: AntTypes):
        nest = self._map.get_entity_by_id(nest_id)
        queen = self._find_queen_in_nest(nest)

        if (not queen):
            raise Exception('queen is not in nest')

        if (not nest):
            raise Exception(f'nest id = {nest_id} is not found')
        
        if (nest.owner_id != user_id):
            raise Exception('used does not own nest')
        
        larva = Larva.build_larva(nest.position, larva_type, queen.dna_profile, 0)
        nest.add_larva(larva)

    def _find_queen_in_nest(self, nest: Nest):
        entities = self._map.get_entities_from_nest(nest.id)
        for entity in entities:
            if entity.type == EntityTypes.ANT and entity.ant_type == AntTypes.QUEEN:
                return entity
        
        return None