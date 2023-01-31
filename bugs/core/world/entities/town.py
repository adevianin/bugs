from .base.plain_entity import PlainEntity
from .entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point

class Town(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, color: str):
        super().__init__(event_bus, id, EntityTypes.TOWN, position)
        self._color = color
        self._area = 300

    @property
    def color(self):
        return self._color

    @property
    def area(self):
        return self._area

    def do_step(self):
        pass

    def to_json(self):
        json = super().to_json()
        json.update({
            'color': self._color
        })
        
        return json