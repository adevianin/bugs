from core.world.entities.climate.climate import Climate
from core.world.entities.base.live_entity.live_entity import LiveEntity

class TemperatureSensorHandler():

    def __init__(self, climate: Climate):
        self._climate = climate

    def handle_sensor(self, entity: LiveEntity):
        entity.body.temperature_sensor.register_temperature(self._climate.daily_temperature, self._climate.direction_of_change)
