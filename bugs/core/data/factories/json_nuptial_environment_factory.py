from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .json_genes_factory import JsonGenesFactory

class JsonNuptialEnvironmentFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory):
        self._json_genes_factory = json_genes_factory

    def build_nuptial_environment_from_json(self, json: dict):
        owner_id = json['owner_id']
        base_genes = self._json_genes_factory.build_genes_from_json(json['base_genes'])
        return NuptialEnvironment.build(owner_id, base_genes)