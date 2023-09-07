from .attack_formation import AttackFormation
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .bring_item_formation import BringItemFormation
from core.world.entities.item.items.base.item import Item

class FormationFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_attack_formation(self, dest_point: Point, unit_step_size: int):
        events = EventEmitter()
        return AttackFormation(self._event_bus, events, dest_point, unit_step_size)
    
    def build_bring_item_formation(self, dest_point: Point, unit_step_size: int, item: Item):
        events = EventEmitter()
        return BringItemFormation(self._event_bus, events, dest_point, unit_step_size, item.position, False)