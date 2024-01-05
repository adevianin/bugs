from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class NestStoredCaloriesChangedAction(Action):

    @classmethod
    def build(cls, actor_id: int, stored_calories: int):
        return NestStoredCaloriesChangedAction(actor_id, ActionTypes.NEST_STORED_CALORIES_CHANGED, ActorTypes.ENTITY, stored_calories)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, stored_calories: int):
        super().__init__(actor_id, action_type, actor_type)
        self.stored_calories = stored_calories
