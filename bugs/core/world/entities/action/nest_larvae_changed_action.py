from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.ant.base.larva import Larva
from typing import List

class NestLarvaeChangedAction(Action):

    @classmethod
    def build(cls, actor_id: int, larvae: List[Larva]):
        return NestLarvaeChangedAction(actor_id, ActionTypes.NEST_LARVAE_CHANGED, ActorTypes.ENTITY, larvae)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, larvae: List[Larva]):
        super().__init__(actor_id, action_type, actor_type)
        self.larvae = larvae
