from core.world.entities.world.notification.notifications.notification import Notification
from core.world.entities.world.notification.notification_types import NotificationTypes
from core.world.entities.world.notification.notifications.died_ant_notification import DiedAntNotification
from core.world.entities.world.notification.notifications.died_nest_notification import DiedNestNotification
from .death_record_serializer import DeathRecordSerializer
from core.world.entities.world.notification.notifications.nest_alarm_raised_notification import NestAlarmRaisedNotification
from core.world.entities.world.notification.notifications.nest_alarm_canceled_notification import NestAlarmCanceledNotification
from core.world.entities.world.notification.notifications.died_colony_notification import DiedColonyNotification

class NotificationSerializer():

    def __init__(self, death_record_serializer: DeathRecordSerializer):
        self._death_record_serializer = death_record_serializer
     
    def serialize(self, notification: Notification):
        match(notification.type):
            case NotificationTypes.DIED_ANT:
                return self._serialize_died_ant(notification)
            case NotificationTypes.DIED_NEST:
                return self._serialize_died_nest(notification)
            case NotificationTypes.NEST_ALARM_RAISED:
                return self._serialize_nest_alarm_raised(notification)
            case NotificationTypes.NEST_ALARM_CANCELED:
                return self._serialize_nest_alarm_canceled(notification)
            case NotificationTypes.DIED_COLONY:
                return self._serialize_died_colony(notification)
            case _:
                raise Exception('unknown type of notification')
            
    def _serialize_common(self, notification: Notification):
        return {
            'type': notification.type,
            'owner_id': notification.owner_id,
            'step': notification.step
        }
            
    def _serialize_died_ant(self, notification: DiedAntNotification):
        props = self._serialize_common(notification)

        props.update({
            'ant_name': notification.ant_name,
            'death_record': self._death_record_serializer.serialize(notification.death_record)
        })

        return props
    
    def _serialize_died_nest(self, notification: DiedNestNotification):
        props = self._serialize_common(notification)

        props.update({
            'nest_position': notification.nest_position,
            'nest_name': notification.nest_name,
            'death_record': self._death_record_serializer.serialize(notification.death_record)
        })

        return props
    
    def _serialize_nest_alarm_raised(self, notification: NestAlarmRaisedNotification):
        props = self._serialize_common(notification)

        props.update({
            'nest_position': notification.nest_position
        })

        return props
    
    
    def _serialize_nest_alarm_canceled(self, notification: NestAlarmCanceledNotification):
        props = self._serialize_common(notification)

        props.update({
            'nest_position': notification.nest_position
        })

        return props
    
    def _serialize_died_colony(self, notification: DiedColonyNotification):
        props = self._serialize_common(notification)

        props.update({
            'colony_name': notification.colony_name,
        })

        return props
