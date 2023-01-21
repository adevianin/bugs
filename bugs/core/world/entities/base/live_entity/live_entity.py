from ..entity import Entity
from ...entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .body import Body

class LiveEntity(Entity):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes, mind: Mind, body: Body):
        super().__init__(event_bus, id, type)
        self._mind = mind
        self._body = body

    @property
    def position(self):
        return self._body.position

    @position.setter
    def position(self, new_position: Point):
        self._body.position = new_position

    def to_json(self):
        json = super().to_json()

        json.update({
            'position': {
                'x': self._body.position.x,
                'y': self._body.position.y
            }
        })

        return json
