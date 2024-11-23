from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.utils.point import Point

class EntityWalkAction(Action):

    def __init__(self, actor_id: int, position: Point, distance_per_step: int):
        super().__init__(actor_id, ActionTypes.ENTITY_WALK, ActorTypes.ENTITY)
        self.position = position
        self.distance_per_step = distance_per_step