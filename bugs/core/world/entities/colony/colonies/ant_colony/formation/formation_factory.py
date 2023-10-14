from .attack_formation import AttackFormation
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .bring_item_formation import BringItemFormation
from core.world.entities.item.items.base.item import Item
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant import Ant
from typing import Dict, List

class FormationFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus
        self._unit_size = AntBody.SIZE

    def build_attack_formation(self, units: List[Ant], dest_point: Point, is_activated: bool, start_position: Point = None):
        events = EventEmitter()
        units = units.copy()
        return AttackFormation(self._event_bus, events, units, start_position, dest_point, is_activated)

    def build_bring_item_formation(self, units: List[Ant], dest_point: Point, is_activated: bool, item: Item):
        events = EventEmitter()
        units = units.copy()
        return BringItemFormation(self._event_bus, events, units, item.position, dest_point, is_activated, item)