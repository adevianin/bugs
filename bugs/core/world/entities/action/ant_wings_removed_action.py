from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class AntWingsRemovedAction(Action):
    
    def __init__(self, actor_id: int):
        super().__init__(actor_id, ActionTypes.ANT_WINGS_REMOVED, ActorTypes.ENTITY)
