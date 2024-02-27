from core.world.entities.ant.base.larva import Larva
from .genome_serializer import GenomeSerializer

from typing import List

class LarvaSerializer():

    def __init__(self, genome_serializer: GenomeSerializer):
        self._genome_serializer = genome_serializer

    def serialize_larva(self, larva: Larva):
        json = {}
        json.update({
            'ant_type': larva.ant_type,
            'ate_calories': larva.ate_calories,
            'genome': self._genome_serializer.serialize_genome(larva.genome)
        })

        return json
    
    def serialize_larvae(self, larvae: List[Larva]):
        json = []

        for larva in larvae:
            json.append(self.serialize_larva(larva))
    
        return json