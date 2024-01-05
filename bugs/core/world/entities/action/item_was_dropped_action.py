from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.utils.point import Point

class ItemWasDroppedAction(Action):

    @classmethod
    def build(cls, actor_id: int, position: Point):
        return ItemWasDroppedAction(actor_id, ActionTypes.ITEM_WAS_DROPPED, ActorTypes.ENTITY, position)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, position: Point):
        super().__init__(actor_id, action_type, actor_type)
        self.position = position