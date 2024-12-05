from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.ant.base.ant_activity_types import AntActivityTypes

class AntCurrentActivityChangedAction(Action):

    def __init__(self, actor_id: int, activity: AntActivityTypes, for_user_id: int):
        super().__init__(actor_id, ActionTypes.ANT_CURRENT_ACTIVITY_CHANGED, ActorTypes.ENTITY, for_user_id)
        self.activity = activity