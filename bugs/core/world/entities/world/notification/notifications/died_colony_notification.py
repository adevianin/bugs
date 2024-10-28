from core.world.entities.world.notification.notification_types import NotificationTypes
from .notification import Notification

class DiedColonyNotification(Notification):

    def __init__(self, owner_id: int, colony_name: str, step: int = None):
        super().__init__(owner_id, step, NotificationTypes.DIED_COLONY)
        self._colony_name = colony_name

    @property
    def colony_name(self):
        return self._colony_name