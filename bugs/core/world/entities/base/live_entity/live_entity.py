from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .body import Body
from core.world.entities.nest.nest import Nest
from core.world.entities.base.enemy_interface import iEnemy

class LiveEntity(Entity, iEnemy):

    def __init__(self, events: EventEmitter, id: int, type: EntityTypes, from_colony_id: int, mind: Mind, body: Body):
        super().__init__(events, id, type, from_colony_id)
        self._mind: Mind = mind
        self._body: Body = body
        self.events: EventEmitter = events

        self.events.add_listener('walk', self._on_body_walk)
        self.events.add_listener('eat_food', self._on_body_eats_food)
        self.events.add_listener('got_in_nest', self._on_got_in_nest)
        self.events.add_listener('got_out_of_nest', self._on_got_out_of_nest)
        self.events.add_listener('hp_changed', self._on_hp_changed)

    @property
    def position(self):
        return self._body.position

    @position.setter
    def position(self, new_position: Point):
        self._body.position = new_position

    @property
    def located_in_nest_id(self):
        return self._body.located_in_nest_id
    
    @property
    def mind(self):
        return self._mind
    
    @property
    def body(self):
        return self._body
    
    @property
    def hp(self):
        return self._body.hp

    @hp.setter
    def hp(self, hp: int):
        self._body.hp = hp

    def walk_to(self, position: Point, sayback: str = None):
        self._mind.walk_to(position=position, sayback=sayback)

    def fight_enemy(self, enemy: iEnemy, sayback: str = None):
        self._mind.fight_enemy(enemy=enemy, sayback=sayback)
    
    def do_step(self):
        super().do_step()

        self._mind.do_step()

    def to_public_json(self):
        json = super().to_public_json()

        json.update({
            'position': {
                'x': self._body.position.x,
                'y': self._body.position.y
            },
            'user_speed': self._body.user_speed,
            'located_in_nest_id': self._body.located_in_nest_id
        })

        return json

    def _on_body_walk(self, position):
        self._emit_action('entity_walk', { 
            'position': {
                'x': position.x,
                'y': position.y
            }
        })

    def _on_body_eats_food(self):
        self._emit_action('entity_eat_food')

    def _on_got_in_nest(self, nest: Nest):
        self._emit_action('entity_got_in_nest', {
            'nest_id': nest.id
        })

    def _on_got_out_of_nest(self):
        self._emit_action('entity_got_out_of_nest')

    def _on_hp_changed(self):
        self._emit_action('entity_hp_change', { 'hp': self.hp })
        if self.hp <= 0:
            self._handle_dieing()
