from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.utils.point import Point

class ItemBeingBringedAction(Action):

    def __init__(self, actor_id: int, new_position: Point, bringing_dist_per_step: int):
        super().__init__(actor_id, ActionTypes.ITEM_BEING_BRINGED, ActorTypes.ENTITY)
        self.new_position = new_position
        self.bringing_dist_per_step = bringing_dist_per_step