from core.world.entities.ant.base.larva import Larva
from core.world.entities.ant.base.ant_types import AntTypes
from .json_genome_factory import JsonGenomeFactory

class JsonLarvaFactory():

    def __init__(self, json_genome_factory: JsonGenomeFactory):
        self._json_genome_factory = json_genome_factory

    def build_larva(self, larva_json: dict):
        ant_type = AntTypes(larva_json['ant_type'])
        ate_calories = larva_json['ate_calories']
        genome = self._json_genome_factory.build_genome_from_json(larva_json['genome'])
        return Larva.build(ant_type, ate_calories, genome)
