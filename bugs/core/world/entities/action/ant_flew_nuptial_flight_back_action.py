from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.utils.point import Point

class AntFlewNuptialFlightBackAction(Action):

    @classmethod
    def build(cls, actor_id: int, landing_position: Point):
        return AntFlewNuptialFlightBackAction(actor_id, ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT_BACK, ActorTypes.ENTITY, landing_position)
    
    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, landing_position: Point):
        super().__init__(actor_id, action_type, actor_type)
        self.landing_position = landing_position
