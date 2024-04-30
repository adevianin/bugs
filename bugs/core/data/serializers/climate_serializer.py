from core.world.entities.climate.climate import Climate

class ClimateSerializer():

    def serialize_climate(self, climate: Climate):
        return {
            'change_direction': climate.change_direction,
            'current_temperature': climate.current_temperature
        }