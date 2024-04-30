from core.world.entities.climate.climate import Climate

class ClimateClientSerializer():

    def serialize(self, climate: Climate):
        return {
            'dailyTemperature': climate.daily_temperature,
            'changeDirection': climate.change_direction
        }