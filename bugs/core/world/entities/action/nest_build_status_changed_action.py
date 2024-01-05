from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class NestBuildStatusChangedAction(Action):

    @classmethod
    def build(cls, actor_id: int, is_built: bool):
        return NestBuildStatusChangedAction(actor_id, ActionTypes.NEST_BUILD_STATUS_CHANGED, ActorTypes.ENTITY, is_built)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, is_built: bool):
        super().__init__(actor_id, action_type, actor_type)
        self.is_built = is_built
