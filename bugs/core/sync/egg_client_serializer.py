from core.world.entities.ant.base.egg import Egg
from .genome_client_serializer import GenomeClientSerializer
from typing import List

class EggClientSerializer():

    def __init__(self, genome_client_serializer: GenomeClientSerializer):
        self._genome_client_serializer = genome_client_serializer

    def serialize_egg(self, egg: Egg):
        return {
            'id': egg.id,
            'name': egg.name,
            'genome': self._genome_client_serializer.serialize_genome(egg.genome),
            'isFertilized': egg.is_fertilized,
            'progress': egg.progress,
            'ant_type': egg.ant_type
        }
    
    def serialize_eggs(self, eggs: List[Egg]):
        json = []

        for egg in eggs:
            json.append(self.serialize_egg(egg))
    
        return json