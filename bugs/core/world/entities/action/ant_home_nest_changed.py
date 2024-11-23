from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntHomeNestChangedAction(Action):

    def __init__(self, actor_id: int, nest_id: int):
        super().__init__(actor_id, ActionTypes.ANT_HOME_NEST_CHANGED, ActorTypes.ENTITY)
        self.nest_id = nest_id