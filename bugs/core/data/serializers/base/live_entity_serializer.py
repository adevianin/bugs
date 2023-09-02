from .entity_serializer import EntitySerializer
from core.world.entities.base.live_entity.live_entity import LiveEntity

class LiveEntitySerializer(EntitySerializer):

    def serialize(self, entity: LiveEntity):
        json = super().serialize(entity)

        json.update({
            'memory': entity.body.memory.records
        })

        return json
