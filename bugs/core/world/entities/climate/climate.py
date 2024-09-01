from core.world.utils.event_emiter import EventEmitter
from core.world.entities.action.climate_temperature_change_action import ClimateTemperatureChangeAction
import math

class Climate():

    MIN_TEMP = 10
    MAX_TEMP = 30
    STEP = 0.2

    @property
    def daily_temperature(self):
        return math.floor(self._current_temp)
    
    @property
    def current_temperature(self):
        return self._current_temp
    
    @property
    def direction_of_change(self):
        return self._direction

    def __init__(self, event_bus: EventEmitter, current_temp: float, direction: int):
        self._event_bus = event_bus
        self._current_temp = current_temp
        self._direction = direction
        self._last_emited_temp = self.daily_temperature

        self._event_bus.add_listener('step_start', self._on_step_start)

    def _do_step(self):
        self._current_temp = round(self._current_temp + self._direction * self.STEP, 3)

        if abs(self._last_emited_temp - self.daily_temperature) >= 1:
            self._emit_temp_change()

        if self._current_temp >= self.MAX_TEMP or self._current_temp <= self.MIN_TEMP:
            self._direction *= -1

    def _emit_temp_change(self):
        action = ClimateTemperatureChangeAction.build(self.daily_temperature, self._direction)
        self._event_bus.emit('action', action)
        self._last_emited_temp = self.daily_temperature

    def _on_step_start(self, step_number):
        self._do_step()
    
