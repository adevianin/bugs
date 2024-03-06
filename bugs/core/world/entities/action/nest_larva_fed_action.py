from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.ant.base.larva import Larva

class NestLarvaFedAction(Action):

    @classmethod
    def build(cls, actor_id: int, larva: Larva, for_user_id: int):
        return NestLarvaFedAction(actor_id, ActionTypes.NEST_LARVA_FED, ActorTypes.ENTITY, larva, for_user_id)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, larva: Larva, for_user_id: int):
        super().__init__(actor_id, action_type, actor_type, for_user_id)
        self.larva = larva
