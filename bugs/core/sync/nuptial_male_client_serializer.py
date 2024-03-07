from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from .genome_client_serializer import GenomeClientSerializer
from .stats_client_serializer import StatsClientSerializer

class NuptialMaleClientSerializer():

    def __init__(self, genome_serializer: GenomeClientSerializer, stats_serializer: StatsClientSerializer):
        self._genome_serializer = genome_serializer
        self._stats_serializer = stats_serializer

    def serialize(self, nuptial_male: NuptialMale) -> dict:
        return {
            'id': nuptial_male.id,
            'genome': self._genome_serializer.serialize_genome(nuptial_male.genome),
            'stats': self._stats_serializer.serialize(nuptial_male.stats),
            'isLocal': nuptial_male.is_local
        }