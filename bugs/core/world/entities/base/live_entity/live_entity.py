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
        super().do_step()
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
    
    def _toggle_is_busy(self, is_busy: bool):
        self._body.toggle_is_busy(is_busy)

    @property
    def _is_busy(self):
        return self._body.is_busy

    def _on_body_walk(self, position):
        self._handle_action('walk', { 
            'position': {
                'x': position.x,
                'y': position.y
            }
        })

    def _on_body_eats_food(self, food_id, is_food_eaten):
        self._handle_action('eat_food', {
            'food_id': food_id,
            'is_food_eaten': is_food_eaten
        })