from .attack_formation import AttackFormation
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .bring_item_formation import BringItemFormation
from core.world.entities.item.items.base.item import Item
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant import Ant
from .convoy_formation import ConvoyFormation
from .base.base_formation import FormationState
from typing import Dict, List

class FormationFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus
        self._unit_size = AntBody.SIZE

    def build_attack_formation(self, name: str, units: List[Ant], destination_point: Point, current_position: Point = None, state: FormationState = None):
        events = EventEmitter()
        units = units.copy()
        return AttackFormation(self._event_bus, events, name, state, units, current_position, destination_point)

    def build_bring_item_formation(self, name: str, units: List[Ant], destination_point: Point, item: Item, state: FormationState = None):
        events = EventEmitter()
        units = units.copy()
        return BringItemFormation(self._event_bus, events, name, state, units, item.position, destination_point, item)
    
    def build_convoy_formation(self, name: str, units: List[Ant], destination_point: Point, current_position: Point = None, state: FormationState = None):
        events = EventEmitter()
        units = units.copy()
        return ConvoyFormation(self._event_bus, events, name, state, units, current_position, destination_point)