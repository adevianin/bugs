from .attack_formation import AttackFormation
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter

class FormationFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_attack_formation(self, dest_point: Point, unit_step_size: int):
        events = EventEmitter()
        return AttackFormation(self._event_bus, events, dest_point, unit_step_size)