from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.ant.base.egg import Egg

class NestEggAddedAction(Action):

    @classmethod
    def build(cls, actor_id: int, egg: Egg, for_user_id: int):
        return NestEggAddedAction(actor_id, ActionTypes.NEST_EGG_ADDED, ActorTypes.ENTITY, egg, for_user_id)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, egg: Egg, for_user_id: int):
        super().__init__(actor_id, action_type, actor_type, for_user_id)
        self.egg = egg
