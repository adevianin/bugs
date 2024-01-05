from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class EntityDiedAction(Action):

    @classmethod
    def build(cls, actor_id: int):
        return EntityDiedAction(actor_id, ActionTypes.ENTITY_DIED, ActorTypes.ENTITY)
