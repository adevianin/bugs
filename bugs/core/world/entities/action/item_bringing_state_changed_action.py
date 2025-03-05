from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ItemBringingStateChangedAction(Action):

    def __init__(self, actor_id: int, is_bringing: bool):
        super().__init__(actor_id, ActionTypes.ITEM_BRINGING_STATE_CHANGED, ActorTypes.ENTITY)
        self.is_bringing = is_bringing