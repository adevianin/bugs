from .plain_entity_serializer import PlainEntitySerializer
from core.world.entities.food.food_source import FoodSource

class FoodSourceSerializer(PlainEntitySerializer):

    def serialize(self, food_source: FoodSource):
        json = super().serialize(food_source)
        json.update({
            'fertility': food_source.fertility,
            'food_type': food_source.food_type,
            'calories': food_source.calories
        })

        return json