from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntPickedUpItemAction(Action):

    @classmethod
    def build(cls, actor_id: int, item_id: int):
        return AntPickedUpItemAction(actor_id, ActionTypes.ANT_PICKED_UP_ITEM, ActorTypes.ENTITY, item_id)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, item_id: int):
        super().__init__(actor_id, action_type, actor_type)
        self.item_id = item_id