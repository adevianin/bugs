from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class NestLarvaRemovedAction(Action):

    def __init__(self, actor_id: int, larva_id: int, for_user_id: int):
        super().__init__(actor_id, ActionTypes.NEST_LARVA_REMOVED, ActorTypes.ENTITY, for_user_id)
        self.larva_id = larva_id
