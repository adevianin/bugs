from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from core.world.entities.nest.nest_build_statuses import NestBuildStatus
from .base.action import Action

class NestBuildStatusChangedAction(Action):

    def __init__(self, actor_id: int, build_status: NestBuildStatus):
        super().__init__(actor_id, ActionTypes.NEST_BUILD_STATUS_CHANGED, ActorTypes.ENTITY)
        self.build_status = build_status
