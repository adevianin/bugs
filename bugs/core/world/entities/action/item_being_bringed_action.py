from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.utils.point import Point

class ItemBeingBringedAction(Action):

    @classmethod
    def build(cls, actor_id: int, new_position: Point, bring_user_speed: int):
        return ItemBeingBringedAction(actor_id, ActionTypes.ITEM_BEING_BRINGED, ActorTypes.ENTITY, new_position, bring_user_speed)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, new_position: Point, bring_user_speed: int):
        super().__init__(actor_id, action_type, actor_type)
        self.new_position = new_position
        self.bring_user_speed = bring_user_speed