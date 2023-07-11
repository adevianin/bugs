from .plain_entity_serializer import PlainEntitySerializer
from core.world.entities.food.food_area import FoodArea

class FoodAreaSerializer(PlainEntitySerializer):

    def serialize(self, food_area: FoodArea):
        json = super().serialize(food_area)
        json.update({
            'size': food_area.size,
            'fertility': food_area.fertility,
            'food_type': food_area.food_type
        })

        return json