from .base.live_entity_serializer import LiveEntitySerializer
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle

class GroundBeetleSerializer(LiveEntitySerializer):

    def serialize(self, ground_beetle: GroundBeetle):
        json = super().serialize(ground_beetle)

        json.update({
            # 'dna_profile': ground_beetle.body.dna_profile,
            'is_auto_thought_generation': ground_beetle.mind.is_auto_thought_generation
        })

        return json