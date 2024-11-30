from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ColonyOperationDeletedAction(Action):

    def __init__(self, actor_id: int, operation_id: str, for_user_id: int):
        super().__init__(actor_id, ActionTypes.COLONY_OPERATION_DELETED, ActorTypes.COLONY, for_user_id)
        self.operation_id = operation_id