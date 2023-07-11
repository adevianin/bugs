from .plain_entity_serializer import PlainEntitySerializer
from core.world.entities.nest.nest import Nest
from .larva_serializer import LarvaSerializer

class NestSerializer(PlainEntitySerializer):

    def __init__(self, larva_serializer: LarvaSerializer):
        self._larva_serializer = larva_serializer

    def serialize(self, entity: Nest):
        json = super().serialize(entity)
        
        json.update({
            'stored_calories': entity.stored_calories,
            'larvae':  self._larva_serializer.serialize_larvae(entity.larvae),
            'larva_places_count': entity.larva_places_count,
            'area': entity.area
        })

        return json
