from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from .genome_client_serializer import GenomeClientSerializer

class NuptialMaleClientSerializer():

    def __init__(self, genome_client_serializer: GenomeClientSerializer):
        self._genome_client_serializer = genome_client_serializer

    def serialize(self, nuptial_male: NuptialMale) -> dict:
        return {
            'id': nuptial_male.id,
            'genome': self._genome_client_serializer.serialize_genome(nuptial_male.genome)
        }