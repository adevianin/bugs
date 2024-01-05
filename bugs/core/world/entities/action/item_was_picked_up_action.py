from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ItemWasPickedUpAction(Action):

    @classmethod
    def build(cls, actor_id: int):
        return ItemWasPickedUpAction(actor_id, ActionTypes.ITEM_WAS_PICKED_UP, ActorTypes.ENTITY)
