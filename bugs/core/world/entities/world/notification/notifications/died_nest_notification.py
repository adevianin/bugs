from core.world.entities.world.notification.notification_types import NotificationTypes
from .notification import Notification
from core.world.utils.point import Point
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord

class DiedNestNotification(Notification):

    def __init__(self, owner_id: int, nest_position: Point, death_record: BaseDeathRecord, step: int = None):
        super().__init__(owner_id, step, NotificationTypes.DIED_NEST)
        self._nest_position = nest_position
        self._death_record = death_record

    @property
    def nest_position(self):
        return self._nest_position
    
    @property
    def death_record(self) -> BaseDeathRecord:
        return self._death_record