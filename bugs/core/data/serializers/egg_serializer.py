from core.world.entities.ant.base.egg import Egg
from .genome_serializer import GenomeSerializer

from typing import List

class EggSerializer():

    def __init__(self, genome_serializer: GenomeSerializer):
        self._genome_serializer = genome_serializer

    def serialize_egg(self, egg: Egg):
        json = {}
        json.update({
            'id': egg.id,
            'name': egg.name,
            'genome': self._genome_serializer.serialize_genome(egg.genome),
            'is_fertilized': egg.is_fertilized,
            'progress': egg.progress,
            'ant_type': egg.ant_type
        })

        return json
    
    def serialize_eggs(self, eggs: List[Egg]):
        json = []

        for egg in eggs:
            json.append(self.serialize_egg(egg))
    
        return json