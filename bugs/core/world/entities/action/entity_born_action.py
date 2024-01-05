from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.base.entity import Entity

class EntityBornAction(Action):

    @classmethod
    def build(cls, entity: Entity):
        return EntityBornAction(entity)

    def __init__(self, entity: Entity):
        super().__init__(entity.id, ActionTypes.ENTITY_BORN, ActorTypes.ENTITY)
        self.entity = entity