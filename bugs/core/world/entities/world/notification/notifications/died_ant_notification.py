from core.world.entities.world.notification.notification_types import NotificationTypes
from .notification import Notification

class DiedAntNotification(Notification):

    def __init__(self, owner_id: int, ant_name: str, step: int = None):
        super().__init__(owner_id, step, NotificationTypes.DIED_ANT)
        self._ant_name = ant_name

    @property
    def ant_name(self):
        return self._ant_name