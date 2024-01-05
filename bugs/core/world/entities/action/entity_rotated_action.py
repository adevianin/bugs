from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class EntityRotatedAction(Action):

    @classmethod
    def build(cls, actor_id: int, angle: int):
        return EntityRotatedAction(actor_id, ActionTypes.ENTITY_ROTATED, ActorTypes.ENTITY, angle)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, angle: int):
        super().__init__(actor_id, action_type, actor_type)
        self.angle = angle