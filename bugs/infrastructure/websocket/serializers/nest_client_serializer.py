from .util_client_serializer import UtilClientSerializer
from core.world.entities.nest.nest import Nest
from .base.entity_client_serializer import EntityClientSerializer
from .larva_client_serializer import LarvaClientSerializer
from .egg_client_serializer import EggClientSerializer

class NestClientSerializer(EntityClientSerializer):

    def __init__(self, util_serializer: UtilClientSerializer, larva_serializer: LarvaClientSerializer, egg_serializer: EggClientSerializer):
        super().__init__(util_serializer)
        self._larva_serializer = larva_serializer
        self._egg_serializer = egg_serializer

    def serialize(self, nest: Nest):
        json = super().serialize(nest)
        
        larvae_json = []
        for larva in nest.larvae:
            larvae_json.append(self._larva_serializer.serialize(larva))

        json.update({
            'storedCalories': nest.stored_calories,
            'larvae': larvae_json,
            'eggs': self._egg_serializer.serialize_eggs(nest.eggs),
            'isBuilt': nest.is_built,
            'fortification': nest.fortification,
            'maxFortification': nest.stats.max_fortification,
            'name': nest.name,
            'isMain': nest.is_main
        })

        return json