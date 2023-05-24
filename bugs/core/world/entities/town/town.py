from ..base.plain_entity import PlainEntity
from ..base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from .larva import Larva

class Town(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, color: str, owner_id: int, larvae: list[Larva], larva_places_count: int):
        super().__init__(event_bus, id, EntityTypes.TOWN, position)
        self._color = color
        self._area = 300
        self._stored_calories = 1000
        self._owner_id = owner_id
        self._larvae = larvae
        self._larva_places_count = larva_places_count

    @property
    def owner_id(self):
        return self._owner_id

    @property
    def color(self):
        return self._color

    @property
    def area(self):
        return self._area

    def do_step(self):
        pass

    def take_food(self, food: Food):
        self._stored_calories += food.calories
        food.die()
        self.handle_action('town_was_given_food', {
            'stored_calories': self._stored_calories
        })

    def give_calories(self, count: int) -> int:
        if (self._stored_calories >= count):
            self._stored_calories -= count
            return count
        else:
            can_give = self._stored_calories
            self._stored_calories = 0
            return can_give

    def to_json(self):
        json = super().to_json()
        json.update({
            'owner_id': self._owner_id,
            'stored_calories': self._stored_calories,
            'larvae': self._larvae_to_json(),
            'larva_places_count': self._larva_places_count
        })
        
        return json
    
    def _larvae_to_json(self):
        larvae_json = []
        for larva in self._larvae:
            larvae_json.append(larva.to_json())
        
        return larvae_json