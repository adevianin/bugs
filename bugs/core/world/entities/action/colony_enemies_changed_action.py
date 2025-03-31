from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from typing import List

class ColonyEnemiesChangedAction(Action):

    def __init__(self, actor_id: int, enemies: List[int], for_user_id: int):
        super().__init__(actor_id, ActionTypes.COLONY_ENEMIES_CHANGED, ActorTypes.COLONY, for_user_id)
        self.enemies = enemies