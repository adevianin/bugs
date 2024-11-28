from ..entity import Entity
from ..entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .mind import Mind
from .live_body import LiveBody
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.action.entity_walk_action import EntityWalkAction
from core.world.entities.base.live_entity.visual_sensor import VisualSensor
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.thought.thought import Thought
from core.world.entities.base.damage_types import DamageTypes

from typing import List

class LiveEntity(Entity, iEnemy):

    _body: LiveBody
    body: LiveBody
    mind: Mind

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, type: EntityTypes, ownership: OwnershipConfig, body: LiveBody, mind: Mind):
        super().__init__(event_bus, events, id, type, ownership, body)
        self._mind: Mind = mind

        self._body.events.add_listener('step', self._on_step)
        self._body.events.add_listener('received_damage', self._on_received_damage)
        self._body.events.add_listener('damaged_another_body', self._on_damaged_another_body)

    @property
    def birth_step(self):
        return self._body.birth_step

    @property
    def mind(self):
        return self._mind
    
    @property
    def visual_sensor(self) -> VisualSensor:
        return self._body.visual_sensor
    
    @property
    def thoughts(self) -> List[Thought]:
        return self._mind.thoughts
    
    @property
    def is_auto_thought_generation(self):
        return self._mind.is_auto_thought_generation
    
    @property
    def formation_distance_per_step(self):
        return self._body.formation_distance_per_step
    
    @formation_distance_per_step.setter
    def formation_distance_per_step(self, val: int):
        self._body.formation_distance_per_step = val
    
    @property
    def is_detectable(self):
        return super().is_detectable and not self._body.am_i_in_hibernation()
    
    @property
    def calories(self):
        return self._body.calories
    
    @property
    def is_hungry(self):
        return self._body.check_am_i_hungry()
    
    def born(self):
        self._body.born()
    
    def set_thoughts(self, thoughts: List[Thought]):
        self._mind.set_thoughts(thoughts)

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
    
    def do_step(self, step_number: int):
        self._body.handle_aging(step_number)
        self._body.handle_exit_hibernation()

        if not self._body.am_i_in_hibernation():
            self._body.handle_temperature()
            self._body.handle_calories()
            if not self.is_died:
                self._mind.do_step()

    def _on_step(self, position: Point, dist_per_step: int):
        self._emit_action(EntityWalkAction(self.id, position, dist_per_step))

    def _on_received_damage(self, damage_type: DamageTypes):
        self.events.emit('received_damage', damage_type)

    def _on_damaged_another_body(self):
        pass