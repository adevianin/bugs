from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class NestRenamedAction(Action):

    def __init__(self, actor_id: int, name: str):
        super().__init__(actor_id, ActionTypes.NEST_RENAMED, ActorTypes.ENTITY)
        self.name = name