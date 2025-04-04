from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntFlewNuptialFlightAction(Action):

    @classmethod
    def build(cls, actor_id: int, is_born_in_nuptial_flight: bool = False):
        return AntFlewNuptialFlightAction(actor_id, is_born_in_nuptial_flight)
    
    def __init__(self, actor_id, is_born_in_nuptial_flight: bool):
        super().__init__(actor_id, ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT, ActorTypes.ENTITY)
        self.is_born_in_nuptial_flight = is_born_in_nuptial_flight
