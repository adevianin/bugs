from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class EntityGotInNestAction(Action):

    @classmethod
    def build(cls, actor_id: int, nest_id: int):
        return EntityGotInNestAction(actor_id, ActionTypes.ENTITY_GOT_IN_NEST, ActorTypes.ENTITY, nest_id)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, nest_id: int):
        super().__init__(actor_id, action_type, actor_type)
        self.nest_id = nest_id