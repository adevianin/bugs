from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .live_body import LiveBody
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.action.entity_walk_action import EntityWalkAction
from core.world.settings import COLD_DAMAGE
from core.world.entities.base.live_entity.visual_sensor import VisualSensor

from typing import List

class LiveEntity(Entity, iEnemy):

    _body: LiveBody
    body: LiveBody
    mind: Mind

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, type: EntityTypes, from_colony_id: int, owner_id: int, body: LiveBody, mind: Mind):
        super().__init__(event_bus, events, id, type, from_colony_id, owner_id, body)
        self._mind: Mind = mind

        self._body.events.add_listener('walk', self._on_walk)
        self._body.events.add_listener('received_combat_damage', self._on_received_combat_damage)

    @property
    def mind(self):
        return self._mind
    
    @property
    def visual_sensor(self) -> VisualSensor:
        return self._body.visual_sensor
    
    @property
    def is_detectable(self):
        return not self.is_died

    def walk_to(self, position: Point, sayback: str = None):
        self._mind.walk_to(position=position, sayback=sayback)

    def fight_enemy(self, enemy: iEnemy, asap: bool = False, sayback: str = None):
        self._mind.fight_enemy(enemy=enemy, sayback=sayback, asap=asap)

    def random_walk(self):
        self._mind.random_walk()

    def wait_step(self, step_count: int = 1, sayback: str = None):
        self._mind.wait_step(step_count=step_count, sayback=sayback)

    def look_around_for_enemies(self) -> List['LiveEntity']:
        return self._body.look_around_for_enemies()
    
    def sort_by_distance(self, entities: List[Entity]) -> List[Entity]:
        return self._body.sort_by_distance(entities)
    
    def do_step(self):
        super().do_step()

        if self._body.check_am_i_freezing():
            self._body.receive_damage(COLD_DAMAGE)

        self._mind.do_step()

    def _on_walk(self, position: Point):
        self.events.emit('walk')
        self._emit_action(EntityWalkAction.build(self.id, position))

    def _on_received_combat_damage(self):
        self.events.emit('received_combat_damage')
