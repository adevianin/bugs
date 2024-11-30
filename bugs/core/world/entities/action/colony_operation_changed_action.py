from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation

class ColonyOperationChangedAction(Action):

    def __init__(self, actor_id: int, operation: Operation, for_user_id: int):
        super().__init__(actor_id, ActionTypes.COLONY_OPERATION_CHANGED, ActorTypes.COLONY, for_user_id)
        self.operation = operation