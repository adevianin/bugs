from core.world.utils.event_emiter import EventEmitter
from core.world.entities.climate.climate import Climate

class ClimateFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_climate(self, current_temp: float, direction: int) -> Climate:
        return Climate(self._event_bus, current_temp, direction)