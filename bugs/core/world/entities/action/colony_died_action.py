from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class ColonyDiedAction(Action):
    
    def __init__(self, colony_id: int):
        super().__init__(colony_id, ActionTypes.COLONY_DIED, ActorTypes.COLONY)
