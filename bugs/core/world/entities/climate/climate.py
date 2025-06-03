from core.world.utils.event_emiter import EventEmitter
from core.world.entities.action.climate_temperature_change_action import ClimateTemperatureChangeAction
from core.world.settings import SUMMER_START_YEAR_STEP, AUTUMN_START_YEAR_STEP, WINTER_START_YEAR_STEP, STEPS_IN_YEAR
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.base.live_entity.thermal_stream_interface import iThermalStream
import math

class Climate(iThermalStream):

    MIN_TEMP = -10
    MAX_TEMP = 35

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
        self._middle_of_summer_year_step = round(SUMMER_START_YEAR_STEP + (AUTUMN_START_YEAR_STEP - SUMMER_START_YEAR_STEP) / 2)
        self._middle_of_winter_year_step = round(WINTER_START_YEAR_STEP + (STEPS_IN_YEAR - WINTER_START_YEAR_STEP) / 2)
        self._step = (Climate.MAX_TEMP - Climate.MIN_TEMP) / ( STEPS_IN_YEAR / 2 )

        self._event_bus.add_listener('step_start', self._on_step_start)

    def _on_step_start(self, step_number: int, season: SeasonTypes):
        self._current_temp = round(self._current_temp + self._direction * self._step, 3)

        year_step = step_number % STEPS_IN_YEAR
        if year_step == self._middle_of_summer_year_step:
            self._direction = -1
            self._current_temp = Climate.MAX_TEMP
        elif year_step == self._middle_of_winter_year_step:
            self._direction = 1
            self._current_temp = Climate.MIN_TEMP

        if abs(self._last_emited_temp - self.daily_temperature) >= 1:
            self._emit_temp_change()

    def _emit_temp_change(self):
        action = ClimateTemperatureChangeAction.build(self.daily_temperature, self._direction)
        self._event_bus.emit('action', action)
        self._last_emited_temp = self.daily_temperature
