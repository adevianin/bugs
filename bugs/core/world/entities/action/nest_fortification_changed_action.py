from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class NestFortificationChangedAction(Action):

    @classmethod
    def build(cls, actor_id: int, fortification: int):
        return NestFortificationChangedAction(actor_id, ActionTypes.NEST_FORTIFICATION_CHANGED, ActorTypes.ENTITY, fortification)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, fortification: int):
        super().__init__(actor_id, action_type, actor_type)
        self.fortification = fortification