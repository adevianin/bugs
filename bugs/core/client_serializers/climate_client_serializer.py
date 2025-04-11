from core.world.entities.climate.climate import Climate

class ClimateClientSerializer():

    def serialize(self, climate: Climate):
        return {
            'dailyTemperature': climate.daily_temperature,
            'directionOfChange': climate.direction_of_change
        }