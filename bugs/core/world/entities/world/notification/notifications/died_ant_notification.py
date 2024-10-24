from core.world.entities.world.notification.notification_types import NotificationTypes
from .notification import Notification
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord

class DiedAntNotification(Notification):

    def __init__(self, owner_id: int, ant_name: str, death_record: BaseDeathRecord, step: int = None):
        super().__init__(owner_id, step, NotificationTypes.DIED_ANT)
        self._ant_name = ant_name
        self._death_record = death_record

    @property
    def ant_name(self):
        return self._ant_name

    @property
    def death_record(self) -> BaseDeathRecord:
        return self._death_record