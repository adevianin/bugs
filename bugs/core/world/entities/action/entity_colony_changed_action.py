from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class EntityColonyChangedAction(Action):

    @classmethod
    def build(cls, actor_id: int, colony_id: int):
        return EntityColonyChangedAction(actor_id, ActionTypes.ENTITY_COLONY_CHANGED, ActorTypes.ENTITY, colony_id)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, colony_id: int):
        super().__init__(actor_id, action_type, actor_type)
        self.colony_id = colony_id