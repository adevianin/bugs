from .base.live_entity_serializer import LiveEntitySerializer
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle

class GroundBeetleSerializer(LiveEntitySerializer):

    def serialize(self, ground_beetle: GroundBeetle):
        json = super().serialize(ground_beetle)

        return json