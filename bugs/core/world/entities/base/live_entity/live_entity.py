from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .live_body import LiveBody
from core.world.entities.nest.nest import Nest
from core.world.entities.base.enemy_interface import iEnemy

class LiveEntity(Entity, iEnemy):

    _body: LiveBody
    body: LiveBody
    mind: Mind

    def __init__(self, events: EventEmitter, id: int, type: EntityTypes, from_colony_id: int, body: LiveBody, mind: Mind):
        super().__init__(events, id, type, from_colony_id, body)
        self._mind: Mind = mind

        self.events.add_listener('walk', self._on_body_walk)
        self.events.add_listener('got_in_nest', self._on_got_in_nest)
        self.events.add_listener('got_out_of_nest', self._on_got_out_of_nest)

    @property
    def mind(self):
        return self._mind

    def walk_to(self, position: Point, sayback: str = None):
        self._mind.walk_to(position=position, sayback=sayback)

    def fight_enemy(self, enemy: iEnemy, sayback: str = None):
        self._mind.fight_enemy(enemy=enemy, sayback=sayback)

    def random_walk(self):
        self._mind.random_walk()
    
    def do_step(self):
        super().do_step()

        self._mind.do_step()

    def to_public_json(self):
        json = super().to_public_json()

        json.update({
            'user_speed': self._body.user_speed
        })

        return json

    def _on_body_walk(self, position: Point):
        self._emit_action('entity_walk', { 
            'position': position.to_public_json()
        })

    def _on_got_in_nest(self, nest: Nest):
        self._emit_action('entity_got_in_nest', {
            'nest_id': nest.id
        })

    def _on_got_out_of_nest(self):
        self._emit_action('entity_got_out_of_nest')
