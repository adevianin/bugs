from core.world.entities.world.notification.notification_types import NotificationTypes
from .notification import Notification
from core.world.utils.point import Point

class NestAlarmCanceledNotification(Notification):

    def __init__(self, owner_id: int, nest_position: Point, nest_name: str, step: int = None):
        super().__init__(owner_id, step, NotificationTypes.NEST_ALARM_CANCELED)
        self._nest_position = nest_position
        self._nest_name = nest_name

    @property
    def nest_position(self):
        return self._nest_position

    @property
    def nest_name(self):
        return self._nest_name