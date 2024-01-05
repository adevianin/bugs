from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

class EntityHpChangedAction(Action):

    @classmethod
    def build(cls, actor_id: int, hp: int):
        return EntityHpChangedAction(actor_id, ActionTypes.ENTITY_HP_CHANGED, ActorTypes.ENTITY, hp)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, hp: int):
        super().__init__(actor_id, action_type, actor_type)
        self.hp = hp