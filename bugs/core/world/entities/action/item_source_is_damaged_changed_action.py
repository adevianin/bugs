from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ItemSourceIsDamagedChangedAction(Action):

    def __init__(self, actor_id: int, is_damaged: bool):
        super().__init__(actor_id, ActionTypes.ITEM_SOURCE_IS_DAMAGED_CHANGED, ActorTypes.ENTITY)
        self.is_damaged = is_damaged