from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntDroppedPickedItemAction(Action):

    @classmethod
    def build(cls, actor_id: int):
        return AntDroppedPickedItemAction(actor_id, ActionTypes.ANT_DROPPED_PICKED_ITEM, ActorTypes.ENTITY)
