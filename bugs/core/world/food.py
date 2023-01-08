from .entity import Entity
from .size import Size
from .entity_types import EntityTypes

class Food(Entity):

    def __init__(self, main_event_bus, id, pos, calories):
        super().__init__(main_event_bus, EntityTypes.FOOD, id, pos, Size(10, 10))
        self._calories = calories
        # self._is_eaten = False

    # def is_eaten(self):
    #     return self._is_eaten

    def get_calories(self):
        return self._calories

    def to_json(self):
        json = super().to_json()
        json.update({
            'calories': self._calories
            # 'eaten': self._is_eaten
        })

        return json

    # def eat(self, calories_to_eat):
    #     calories_eaten = calories_to_eat if self._calories > calories_to_eat else self._calories
    #     self._calories -= calories_to_eat
    #     if self._calories <= 0:
    #         self._is_eaten = True
    #         self.emit_change()
    #         self._main_event_bus.emit('eaten', self)

    #     return calories_eaten
        

    