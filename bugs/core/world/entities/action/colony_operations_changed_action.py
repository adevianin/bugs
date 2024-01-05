from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from typing import List

class ColonyOperationsChangedAction(Action):

    @classmethod
    def build(cls, actor_id: int, operations: List[Operation]):
        return ColonyOperationsChangedAction(actor_id, ActionTypes.COLONY_OPERATIONS_CHANGED, ActorTypes.COLONY, operations)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, operations: List[Operation]):
        super().__init__(actor_id, action_type, actor_type)
        self.operations = operations