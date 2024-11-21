from .base.live_entity_serializer import LiveEntitySerializer
from core.world.entities.ladybug.ladybug import Ladybug

class LadybugSerializer(LiveEntitySerializer):

    def serialize(self, ladybug: Ladybug):
        json = super().serialize(ladybug)

        return json