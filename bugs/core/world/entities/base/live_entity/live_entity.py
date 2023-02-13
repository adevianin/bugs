from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .body import Body
from core.world.entities.base.live_entity.action.action_builder import ActionBuilder

class LiveEntity(Entity):

    def __init__(self, event_bus: EventEmitter, action_builder: ActionBuilder, id: int, type: EntityTypes, mind: Mind, body: Body):
        super().__init__(event_bus, id, type)
        self._mind = mind
        self._body = body
        self._action_builder = action_builder

        self._body.events.add_listener('walk', self._on_body_walk)

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

    def emit_action(self, action_type: str, consumed_time_points: int, action_data: dict = None):
        action = self._action_builder.build_action(self.id, action_type, consumed_time_points, action_data)
        self._event_bus.emit('action_occured', action)

    def _on_body_walk(self, position, consumed_time_points):
        self.emit_action('walk', consumed_time_points, { 
            'position': {
                'x': position.x,
                'y': position.y
            }
        })