from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .body import Body
from core.world.entities.town.town import Town

class LiveEntity(Entity):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes, owner_id: int, mind: Mind, body: Body):
        super().__init__(event_bus, id, type, owner_id)
        self._mind = mind
        self._body = body

        self._body.events.add_listener('walk', self._on_body_walk)
        self._body.events.add_listener('eat_food', self._on_body_eats_food)
        self._body.events.add_listener('got_in_town', self._on_got_in_town)
        self._body.events.add_listener('got_out_of_town', self._on_got_out_of_town)

    @property
    def position(self):
        return self._body.position

    @position.setter
    def position(self, new_position: Point):
        self._body.position = new_position

    @property
    def dna_profile(self):
        return self._body.dna_profile
    
    @property
    def located_in_town_id(self):
        return self._body.located_in_town_id

    def is_hidden(self):
        return super().is_hidden or self._body.is_in_town

    def do_step(self):
        super().do_step()
        self._toggle_is_busy(False)

        if self._body.is_no_calories:
            self.die()
            return

        self._mind.do_step()

    def to_json(self):
        json = super().to_json()

        json.update({
            'position': {
                'x': self._body.position.x,
                'y': self._body.position.y
            },
            'user_speed': self._body.user_speed,
            'located_in_town_id': self._body.located_in_town_id
        })

        return json
    
    def handle_action(self, action_type: str, action_data: dict = None):
        if (self.is_busy):
            raise Exception('live entity can do only 1 action per step')
        super().handle_action(action_type, action_data)
        self._toggle_is_busy(True)
    
    @property
    def is_busy(self):
        return self._body.is_busy
    
    def _toggle_is_busy(self, is_busy: bool):
        self._body.toggle_is_busy(is_busy)

    def _on_body_walk(self, position):
        self.handle_action('entity_walk', { 
            'position': {
                'x': position.x,
                'y': position.y
            }
        })

    def _on_body_eats_food(self):
        self.handle_action('entity_eat_food')

    def _on_got_in_town(self, town: Town):
        self.handle_action('entity_got_in_town', {
            'town_id': town.id
        })

    def _on_got_out_of_town(self):
        self.handle_action('entity_got_out_of_town')

