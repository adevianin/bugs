from core.world.entities.world.notification.notification_types import NotificationTypes
from .notification import Notification
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from core.world.entities.ant.base.ant_types import AntTypes

class DiedAntNotification(Notification):

    def __init__(self, owner_id: int, ant_name: str, ant_type: AntTypes, is_queen_of_colony: bool, death_record: BaseDeathRecord, step: int = None):
        super().__init__(owner_id, step, NotificationTypes.DIED_ANT)
        self._ant_name = ant_name
        self._ant_type = ant_type
        self._is_queen_of_colony = is_queen_of_colony
        self._death_record = death_record

    @property
    def ant_name(self):
        return self._ant_name

    @property
    def ant_type(self) -> AntTypes:
        return self._ant_type

    @property
    def is_queen_of_colony(self) -> bool:
        return self._is_queen_of_colony

    @property
    def death_record(self) -> BaseDeathRecord:
        return self._death_record