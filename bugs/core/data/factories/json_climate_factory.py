from core.world.entities.climate.climate_factory import ClimateFactory

class JsonClimateFactory():

    def __init__(self, climate_factory: ClimateFactory):
        self._climate_factory = climate_factory

    def build_climate_from_json(self, climate_json: dict):
        direction = climate_json['direction_of_change']
        currecnt_temp = climate_json['current_temperature']
        return self._climate_factory.build_climate(currecnt_temp, direction)