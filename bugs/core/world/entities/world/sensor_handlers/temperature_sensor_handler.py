from core.world.entities.map.map import Map
from core.world.entities.climate.climate import Climate

class TemperatureSensorHandler():

    def __init__(self, map: Map, climate: Climate):
        self._map = map
        self._climate = climate

    def handle_sensors(self):
        live_entities = self._map.get_live_entities()
        for entity in live_entities:
            entity.body.temperature_sensor.register_temperature(self._climate.daily_temperature, self._climate.direction_of_change)
