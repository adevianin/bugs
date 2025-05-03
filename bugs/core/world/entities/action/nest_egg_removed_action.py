from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class NestEggRemovedAction(Action):

    def __init__(self, actor_id: int, egg_id: int, for_user_id: int):
        super().__init__(actor_id, ActionTypes.NEST_EGG_REMOVED, ActorTypes.ENTITY, for_user_id)
        self.egg_id = egg_id
