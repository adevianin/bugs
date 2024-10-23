from core.world.utils.event_emiter import EventEmitter
from .notifications.notification import Notification
from core.world.entities.action.user_notification_action import UserNotificationAction

from typing import List

class NotificationManager():

    def __init__(self, event_bus: EventEmitter, notifications: List[Notification]):
        self._event_bus = event_bus
        self._current_step = 0
        self._notification_packs = {}

        self._break_in_packages(notifications)

        self._event_bus.add_listener('step_start', self._on_step_start)
        self._event_bus.add_listener('notification', self._on_notification)

    def get_all_notifications(self) -> List[Notification]:
        res = []
        for notification_pack in self._notification_packs.values():
            res += notification_pack
        return res

    def get_notifications_for_owner(self, owner_id: int) -> List[Notification]:
        return self._notification_packs.get(owner_id, [])
    
    def _break_in_packages(self, notifications: List[Notification]):
        for notification in notifications:
            self._push_notification_to_packs(notification)
    
    def _push_notification_to_packs(self, notification: Notification):
        notification_pack: List[Notification] = self._notification_packs.get(notification.owner_id, [])
        notification_pack.append(notification)
        self._notification_packs[notification.owner_id] = notification_pack

    def _on_step_start(self, step_number: int):
        self._current_step = step_number

    def _on_notification(self, notification: Notification):
        notification.step = self._current_step
        self._push_notification_to_packs(notification)
        action = UserNotificationAction.build(notification.owner_id, notification, notification.owner_id)
        self._event_bus.emit('action', action)