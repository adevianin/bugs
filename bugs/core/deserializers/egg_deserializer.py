from core.world.entities.ant.base.egg import Egg
from core.world.entities.ant.base.ant_types import AntTypes
from .genome_deserializer import GenomeDeserializer

class EggDeserializer():

    def __init__(self, genome_deserializer: GenomeDeserializer):
        self._genome_deserializer = genome_deserializer

    def deserialize_egg(self, egg_json: dict):
        id = egg_json['id']
        name = egg_json['name']
        genome = self._genome_deserializer.deserialize_genome(egg_json['genome'])
        progress = egg_json['progress']
        ant_type = AntTypes(egg_json['ant_type']) if egg_json['ant_type'] else None
        return Egg.build(id, name, genome, progress, ant_type)
