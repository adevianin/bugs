from core.world.entities.ant.base.egg import Egg
from core.world.entities.ant.base.ant_types import AntTypes
from .json_genome_factory import JsonGenomeFactory

class JsonEggFactory():

    def __init__(self, json_genome_factory: JsonGenomeFactory):
        self._json_genome_factory = json_genome_factory

    def build_egg(self, egg_json: dict):
        id = egg_json['id']
        name = egg_json['name']
        genome = self._json_genome_factory.build_genome_from_json(egg_json['genome'])
        progress = egg_json['progress']
        ant_type = AntTypes(egg_json['ant_type']) if egg_json['ant_type'] else None
        return Egg.build(id, name, genome, progress, ant_type)
