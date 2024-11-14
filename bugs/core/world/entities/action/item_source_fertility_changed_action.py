from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ItemSourceFertilityChangeAction(Action):

    def __init__(self, actor_id: int, is_fertile: bool):
        super().__init__(actor_id, ActionTypes.ITEM_SOURCE_FERTILITY_CHANGED, ActorTypes.ENTITY)
        self.is_fertile = is_fertile