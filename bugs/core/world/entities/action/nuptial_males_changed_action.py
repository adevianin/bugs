from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale

from typing import List

class NuptialMalesChangedAction(Action):

    def __init__(self, males: List[NuptialMale], for_user_id: int):
        super().__init__(None, ActionTypes.NUPTIAL_ENVIRONMENT_MALES_CHANGED, ActorTypes.NUPTIAL_ENVIRONMENT, for_user_id)
        self.males = males
