from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.enemy_interface import iEnemy
from .fight import Fight

from typing import List

class FightFactory():

    def build_fight(self, units: List[Ant]):
        events = EventEmitter()
        return Fight(events, units)