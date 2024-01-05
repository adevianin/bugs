from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.colony.base.colony import Colony

class ColonyBornAction(Action):

    @classmethod
    def build(cls, colony: Colony):
        return ColonyBornAction(colony.id, ActionTypes.COLONY_BORN, ActorTypes.COLONY, colony)
    
    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, colony: Colony):
        super().__init__(actor_id, action_type, actor_type)
        self.colony = colony
