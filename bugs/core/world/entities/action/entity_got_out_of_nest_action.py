from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class EntityGotOutOfNestAction(Action):

    @classmethod
    def build(cls, actor_id: int):
        return EntityGotOutOfNestAction(actor_id, ActionTypes.ENTITY_GOT_OUT_OF_NEST, ActorTypes.ENTITY)
    