from core.world.entities.ant.base.larva import Larva
from core.world.entities.ant.base.ant_types import AntTypes
from .genome_deserializer import GenomeDeserializer

class LarvaDeserializer():

    def __init__(self, genome_deserializer: GenomeDeserializer):
        self._genome_deserializer = genome_deserializer

    def deserialize_larva(self, larva_json: dict):
        id = larva_json['id']
        name = larva_json['name']
        ant_type = AntTypes(larva_json['ant_type'])
        ate_food = larva_json['ate_food']
        genome = self._genome_deserializer.deserialize_genome(larva_json['genome'])
        return Larva.build(id, name, ant_type, ate_food, genome)
