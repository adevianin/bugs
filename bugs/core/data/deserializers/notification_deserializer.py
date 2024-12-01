from core.world.entities.world.notification.notification_types import NotificationTypes
from core.world.utils.point import Point
from core.world.entities.world.notification.notifications.died_ant_notification import DiedAntNotification
from core.world.entities.world.notification.notifications.died_nest_notification import DiedNestNotification
from .death_record_deserializer import DeathRecordDeserializer
from core.world.entities.world.notification.notifications.nest_alarm_raised_notification import NestAlarmRaisedNotification
from core.world.entities.world.notification.notifications.nest_alarm_canceled_notification import NestAlarmCanceledNotification
from core.world.entities.world.notification.notifications.died_colony_notification import DiedColonyNotification

class NotificationDeserializer():

    def __init__(self, death_record_deserializer: DeathRecordDeserializer):
        self._death_record_deserializer = death_record_deserializer

    def deserialize(self, json: dict):
        type = NotificationTypes(json['type'])

        match(type):
            case NotificationTypes.DIED_ANT:
                return self._build_died_ant_notification(json)
            case NotificationTypes.DIED_NEST:
                return self._build_died_nest_notification(json)
            case NotificationTypes.NEST_ALARM_RAISED:
                return self._build_nest_alarm_raised(json)
            case NotificationTypes.NEST_ALARM_CANCELED:
                return self._build_nest_alarm_canceled(json)
            case NotificationTypes.DIED_COLONY:
                return self._build_died_colony(json)
            case _:
                raise Exception('unknown type of notification')
            
    def _build_died_ant_notification(self, json: dict):
        death_record = self._death_record_deserializer.deserialize(json['death_record'])
        return DiedAntNotification(json['owner_id'], json['ant_name'], death_record, json['step'])
    
    def _build_died_nest_notification(self, json: dict):
        nest_position = Point.from_json(json['nest_position'])
        nest_name = json['nest_name']
        death_record = self._death_record_deserializer.deserialize(json['death_record'])
        return DiedNestNotification(json['owner_id'], nest_position, nest_name, death_record, json['step'])
    
    def _build_nest_alarm_raised(self, json: dict):
        nest_position = Point.from_json(json['nest_position'])
        return NestAlarmRaisedNotification(json['owner_id'], nest_position, json['step'])
    
    def _build_nest_alarm_canceled(self, json: dict):
        nest_position = Point.from_json(json['nest_position'])
        return NestAlarmCanceledNotification(json['owner_id'], nest_position, json['step'])
    
    def _build_died_colony(self, json: dict):
        return DiedColonyNotification(json['owner_id'], json['colony_name'], json['step'])