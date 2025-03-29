from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ItemSourceAccumulatedChangedAction(Action):

    def __init__(self, actor_id: int, accumulated: int):
        super().__init__(actor_id, ActionTypes.ITEM_SOURCE_ACCUMULATED_CHANGED, ActorTypes.ENTITY)
        self.accumulated = accumulated