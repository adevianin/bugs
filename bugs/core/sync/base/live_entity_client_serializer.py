from core.world.entities.base.live_entity.live_entity import LiveEntity
from .entity_client_serializer import EntityClientSerializer

class LiveEntityClientSerializer(EntityClientSerializer):

    def serialize(self, entity: LiveEntity):
        json = super().serialize(entity)
        json.update({
        })
        return json