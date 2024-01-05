from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntFlewNuptialFlightAction(Action):

    @classmethod
    def build(cls, actor_id: int):
        return AntFlewNuptialFlightAction(actor_id, ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT, ActorTypes.ENTITY)
