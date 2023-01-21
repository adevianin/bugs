from ..base.plain_entity import PlainEntity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point

class Food(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, calories: int):
        super().__init__(event_bus, id, EntityTypes.FOOD, position)
        self._calories = calories

    @property
    def calories(self):
        return self._calories

    def do_step(self):
        pass

    def to_json(self):
        json = super().to_json()
        json.update({
            'calories': self._calories
        })
        
        return json