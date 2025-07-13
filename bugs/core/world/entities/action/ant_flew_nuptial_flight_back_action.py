from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.utils.point import Point

class AntFlewNuptialFlightBackAction(Action):
    
    def __init__(self, actor_id: int, landing_position: Point, from_position: Point):
        super().__init__(actor_id, ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT_BACK, ActorTypes.ENTITY)
        self.landing_position = landing_position
        self.from_position = from_position
