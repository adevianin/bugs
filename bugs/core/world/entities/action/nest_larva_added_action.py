from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.ant.base.larva import Larva

class NestLarvaAddedAction(Action):

    def __init__(self, actor_id: int, larva: Larva, for_user_id: int):
        super().__init__(actor_id, ActionTypes.NEST_LARVA_ADDED, ActorTypes.ENTITY, for_user_id)
        self.larva = larva
