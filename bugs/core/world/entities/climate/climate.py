from core.world.utils.event_emiter import EventEmitter
from core.world.entities.action.climate_temperature_change_action import ClimateTemperatureChangeAction
from core.world.settings import SUMMER_START_YEAR_STEP, AUTUMN_START_YEAR_STEP, WINTER_START_YEAR_STEP, STEPS_IN_YEAR, SPRING_START_YEAR_STEP
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.base.live_entity.thermal_stream_interface import iThermalStream
import math

class Climate(iThermalStream):

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

        middle_of_summer_year_step = round(SUMMER_START_YEAR_STEP + (AUTUMN_START_YEAR_STEP - SUMMER_START_YEAR_STEP) / 2)
        middle_of_winter_year_step = round(WINTER_START_YEAR_STEP + (STEPS_IN_YEAR - WINTER_START_YEAR_STEP) / 2)
        self._temp_intervals = [
            { 'year_step_start': SPRING_START_YEAR_STEP, 'year_step_end': SUMMER_START_YEAR_STEP, 'temp_start': 0, 'temp_end': 15 },
            { 'year_step_start': SUMMER_START_YEAR_STEP, 'year_step_end': middle_of_summer_year_step, 'temp_start': 15, 'temp_end': 35 },
            { 'year_step_start': middle_of_summer_year_step, 'year_step_end': AUTUMN_START_YEAR_STEP, 'temp_start': 35, 'temp_end': 20 },
            { 'year_step_start': AUTUMN_START_YEAR_STEP, 'year_step_end': WINTER_START_YEAR_STEP, 'temp_start': 20, 'temp_end': -1 },
            { 'year_step_start': WINTER_START_YEAR_STEP, 'year_step_end': middle_of_winter_year_step, 'temp_start': -1, 'temp_end': -10 },
            { 'year_step_start': middle_of_winter_year_step, 'year_step_end': STEPS_IN_YEAR, 'temp_start': -10, 'temp_end': 0 },
        ]

        self._event_bus.add_listener('step_start', self._on_step_start)

    def _get_current_temp_interval(self, year_step: int):
        for temp_interval in self._temp_intervals:
            if (year_step >= temp_interval['year_step_start'] and year_step < temp_interval['year_step_end']):
                return temp_interval

    def _on_step_start(self, step_number: int, season: SeasonTypes):
        current_year_step = step_number % STEPS_IN_YEAR
        temp_interval = self._get_current_temp_interval(current_year_step)
        interval_steps_count = temp_interval['year_step_end'] - temp_interval['year_step_start']
        interval_temp_change = temp_interval['temp_end'] - temp_interval['temp_start']
        temp_step = interval_temp_change / interval_steps_count
        self._current_temp = round(temp_interval['temp_start'] + (current_year_step - temp_interval['year_step_start']) * temp_step, 3)

        if abs(self._last_emited_temp - self.daily_temperature) >= 1:
            self._emit_temp_change()

    def _emit_temp_change(self):
        action = ClimateTemperatureChangeAction.build(self.daily_temperature, self._direction)
        self._event_bus.emit('action', action)
        self._last_emited_temp = self.daily_temperature
