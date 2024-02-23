from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .genome_serializer import GenomeSerializer

class NuptialEnvironmentSerializer():

    def __init__(self, genome_serializer: GenomeSerializer):
        self._genome_serializer = genome_serializer

    def serialize(self, nuptial_environment: NuptialEnvironment):
        return {
            'owner_id': nuptial_environment.owner_id,
            'base_chromosomes_set': self._genome_serializer.serialize_chromosomes_set(nuptial_environment.base_chromosomes_set)
        }