from core.world.entities.ant.base.larva import Larva
from .genome_client_serializer import GenomeClientSerializer

class LarvaClientSerializer():

    def __init__(self, genome_serializer: GenomeClientSerializer):
        self._genome_serializer = genome_serializer

    def serialize(self, larva: Larva):
        return {
            'id': larva.id,
            'name': larva.name,
            'antType': larva.ant_type,
            'requiredFood': larva.required_food,
            'ateFood': larva.ate_food,
            'genome': self._genome_serializer.serialize_genome(larva.genome)
        }