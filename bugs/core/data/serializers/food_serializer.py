from .plain_entity_serializer import PlainEntitySerializer
from core.world.entities.food.food import Food

class FoodSerializer(PlainEntitySerializer):

    def serialize(self, food: Food):
        json = super().serialize(food)
        json.update({
            'calories': food.calories,
            'food_type': food.food_type,
            'food_variety': food.food_variety
        })

        return json
