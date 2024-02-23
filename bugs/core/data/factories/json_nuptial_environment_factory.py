from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .json_genome_factory import JsonGenomeFactory

class JsonNuptialEnvironmentFactory():

    def __init__(self, genome_factory: JsonGenomeFactory):
        self._genome_factory = genome_factory

    def build_nuptial_environment_from_json(self, json: dict):
        owner_id = json['owner_id']
        base_chromosomes_set = self._genome_factory.build_chromosomes_set_from_json(json['base_chromosomes_set'])
        return NuptialEnvironment.build(owner_id, base_chromosomes_set)