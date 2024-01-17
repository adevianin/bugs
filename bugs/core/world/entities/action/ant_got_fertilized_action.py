from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntGotFertilizedAction(Action):

    @classmethod
    def build(cls, actor_id: int):
        return AntGotFertilizedAction(actor_id, ActionTypes.ANT_GOT_FERTILIZED, ActorTypes.ENTITY)
