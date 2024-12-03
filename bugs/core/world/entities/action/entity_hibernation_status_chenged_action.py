from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class EntityHibernationStatusChangedAction(Action):

    def __init__(self, actor_id: int, is_in_hibernation: bool):
        super().__init__(actor_id, ActionTypes.ENTITY_HIBERNATION_STATUS_CHANGED, ActorTypes.ENTITY)
        self.is_in_hibernation = is_in_hibernation