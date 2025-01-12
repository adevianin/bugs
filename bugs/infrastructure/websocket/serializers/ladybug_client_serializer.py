from .base.live_entity_client_serializer import LiveEntityClientSerializer
from core.world.entities.ladybug.ladybug import Ladybug

class LadybugClientSerializer(LiveEntityClientSerializer):

    def serialize(self, bug: Ladybug):
        json = super().serialize(bug)
        
        return json