from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .genes_serializer import GenesSerializer

class NuptialEnvironmentSerializer():

    def __init__(self, genes_serializer: GenesSerializer):
        self._genes_serializer = genes_serializer

    def serialize(self, nuptial_environment: NuptialEnvironment):
        return {
            'owner_id': nuptial_environment.owner_id,
            'base_genes': self._genes_serializer.serialize(nuptial_environment.base_genes)
        }