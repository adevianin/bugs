from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .body import Body
from core.world.action.action_accumulator import ActionAccumulator

class LiveEntity(Entity):

    def __init__(self, event_bus: EventEmitter, action_accumulator: ActionAccumulator, id: int, type: EntityTypes, mind: Mind, body: Body):
        super().__init__(event_bus, id, type)
        self._mind = mind
        self._body = body
        self._action_accumulator = action_accumulator

        self._body.events.add_listener('walk', self._on_body_walk)
        self._body.events.add_listener('eat_food', self._on_body_eats_food)

    @property
    def position(self):
        return self._body.position

    @position.setter
    def position(self, new_position: Point):
        self._body.position = new_position

    def do_step(self):
        self._body.restore_time_points()
        self._mind.do_step()

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
        self._action_accumulator.accumulate_entity_action(self.id, action_type, consumed_time_points, action_data)

    def _on_body_walk(self, position, consumed_time_points):
        self.emit_action('walk', consumed_time_points, { 
            'position': {
                'x': position.x,
                'y': position.y
            }
        })

    def _on_body_eats_food(self, consumed_time_points, food_id, is_food_eaten):
        self.emit_action('eat_food', consumed_time_points, {
            'food_id': food_id,
            'is_food_eaten': is_food_eaten
        })