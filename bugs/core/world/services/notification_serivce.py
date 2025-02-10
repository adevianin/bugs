from .base_service import BaseService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.notification.notifications.notification import Notification
from core.world.entities.action.user_notification_action import UserNotificationAction

from typing import List

class NotificationService(BaseService):

    def __init__(self, event_bus: EventEmitter):
        super().__init__(event_bus)

        self._event_bus.add_listener('notification', self._on_notification)

    def find_notifications_for_owner(self, owner_id: int) -> List[Notification]:
        res = []
        for notification in self._world.notifications:
            if notification.owner_id == owner_id:
                res.append(notification)

        return res

    def _on_notification(self, notification: Notification):
        notification.step = self._world.current_step
        self._world.add_new_notification(notification)
        action = UserNotificationAction.build(notification.owner_id, notification, notification.owner_id)
        self._emit_action(action)
