from core.world.entities.climate.climate import Climate

class ClimateSerializer():

    def serialize_climate(self, climate: Climate):
        return {
            'direction_of_change': climate.direction_of_change,
            'current_temperature': climate.current_temperature
        }