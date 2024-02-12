from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .genes_serializer import GenesSerializer

class NuptialEnvironmentSerializer():

    def serialize(self, nuptial_environment: NuptialEnvironment):
        return {
            'owner_id': nuptial_environment.owner_id
        }