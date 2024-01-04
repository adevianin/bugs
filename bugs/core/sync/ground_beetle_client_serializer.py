from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from .base.live_entity_client_serializer import LiveEntityClientSerializer

class GroundBeetleClientSerializer(LiveEntityClientSerializer):

    def serialize(self, beetle: GroundBeetle):
        json = super().serialize(beetle)
        
        return json