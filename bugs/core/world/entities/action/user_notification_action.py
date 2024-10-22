from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.world.notification.notifications.notification import Notification

class UserNotificationAction(Action):

    @classmethod
    def build(cls, actor_id: int, notification: Notification, for_user_id: int):
        return UserNotificationAction(actor_id, ActionTypes.USER_NOTIFICATION, ActorTypes.USER, notification, for_user_id)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, notification: Notification, for_user_id: int):
        super().__init__(actor_id, action_type, actor_type, for_user_id)
        self.notification = notification
