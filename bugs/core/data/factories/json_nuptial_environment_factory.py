from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .json_genes_factory import JsonGenesFactory
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory

class JsonNuptialEnvironmentFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory, nuptial_environment_factory: NuptialEnvironmentFactory):
        self._json_genes_factory = json_genes_factory
        self._nuptial_environment_factory = nuptial_environment_factory

    def build_nuptial_environment_from_json(self, json: dict):
        owner_id = json['owner_id']
        base_genes = self._json_genes_factory.build_genes_from_json(json['base_genes'])
        return self._nuptial_environment_factory.build(owner_id, base_genes)