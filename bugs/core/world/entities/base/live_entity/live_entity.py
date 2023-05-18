from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .body import Body

class LiveEntity(Entity):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes, mind: Mind, body: Body):
        super().__init__(event_bus, id, type)
        self._mind = mind
        self._body = body

        self._body.events.add_listener('walk', self._on_body_walk)
        self._body.events.add_listener('eat_food', self._on_body_eats_food)

    @property
    def position(self):
        return self._body.position

    @position.setter
    def position(self, new_position: Point):
        self._body.position = new_position

    def do_step(self):
        self._body.toggle_is_busy(False)
        self._mind.do_step()

    def to_json(self):
        json = super().to_json()

        json.update({
            'position': {
                'x': self._body.position.x,
                'y': self._body.position.y
            },
            'user_speed': self._body.user_speed
        })

        return json

    def handle_action(self, action_type: str, action_data: dict = None):
        if (self._body.is_busy):
            raise Exception('entity can do only 1 action per step')
        self._event_bus.emit('step_action_occurred', self.id, action_type, action_data)
        self._body.toggle_is_busy(True)

    def _on_body_walk(self, position):
        self.handle_action('walk', { 
            'position': {
                'x': position.x,
                'y': position.y
            }
        })

    def _on_body_eats_food(self, food_id, is_food_eaten):
        self.handle_action('eat_food', {
            'food_id': food_id,
            'is_food_eaten': is_food_eaten
        })