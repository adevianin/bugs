from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntHungryStateChangedAction(Action):

    def __init__(self, actor_id: int, is_hungry: bool, for_user_id: int):
        super().__init__(actor_id, ActionTypes.ANT_HUNGRY_STATE_CHANGED, ActorTypes.ENTITY, for_user_id)
        self.is_hungry = is_hungry