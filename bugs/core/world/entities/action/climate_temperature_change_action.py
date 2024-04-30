from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ClimateTemperatureChangeAction(Action):

    @classmethod
    def build(cls, daily_temperature: int, change_direction: int):
        return ClimateTemperatureChangeAction(daily_temperature, change_direction)

    def __init__(self, daily_temperature: int, change_direction: int):
        super().__init__(None, ActionTypes.CLIMATE_TEMPERATURE_CHANGE, ActorTypes.CLIMATE)
        self.daily_temperature = daily_temperature
        self.change_direction = change_direction

    