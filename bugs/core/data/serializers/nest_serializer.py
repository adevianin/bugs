from .base.entity_serializer import EntitySerializer
from core.world.entities.nest.nest import Nest
from .larva_serializer import LarvaSerializer
from .egg_serializer import EggSerializer

class NestSerializer(EntitySerializer):

    def __init__(self, larva_serializer: LarvaSerializer, egg_serializer: EggSerializer):
        self._larva_serializer = larva_serializer
        self._egg_serializer = egg_serializer

    def serialize(self, entity: Nest):
        json = super().serialize(entity)
        
        json.update({
            'stored_calories': entity.stored_calories,
            'larvae':  self._larva_serializer.serialize_larvae(entity.larvae),
            'eggs':  self._egg_serializer.serialize_eggs(entity.eggs),
            'area': entity.area,
            'build_progress': entity.build_progress,
            'fortification': entity.fortification,
            'nearby_food_sources_data': entity.nearby_food_sources_data_manager.data
        })

        return json
