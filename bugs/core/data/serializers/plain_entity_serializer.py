from .entity_serializer import EntitySerializer
from core.world.entities.base.plain_entity import PlainEntity

class PlainEntitySerializer(EntitySerializer):

    def serialize(self, entity: PlainEntity):
        json = super().serialize(entity)
        json.update({
            'position': entity.position
        })

        return json
