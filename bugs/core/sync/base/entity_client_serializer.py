from core.world.entities.base.entity import Entity
from ..util_client_serializer import UtilClientSerializer

class EntityClientSerializer():

    def __init__(self, util_serializer: UtilClientSerializer):
        self._util_serializer = util_serializer

    def serialize(self, entity: Entity):
        return {
            'id': entity.id,
            'type': entity.type,
            'from_colony_id': entity.from_colony_id,
            'hp': entity.body.hp,
            'max_hp': entity.body.stats.max_hp,
            'position': self._util_serializer.serialize_point(entity.body.position),
            'angle': entity.body.angle
        }