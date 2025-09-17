from .util_client_serializer import UtilClientSerializer
from core.world.entities.world.notification.notifications.notification import Notification
from core.world.entities.world.notification.notification_types import NotificationTypes
from core.world.entities.world.notification.notifications.died_ant_notification import DiedAntNotification
from core.world.entities.world.notification.notifications.died_nest_notification import DiedNestNotification
from .death_record_client_serializer import DeathRecordClientSerializer
from core.world.entities.world.notification.notifications.nest_alarm_raised_notification import NestAlarmRaisedNotification
from core.world.entities.world.notification.notifications.nest_alarm_canceled_notification import NestAlarmCanceledNotification
from core.world.entities.world.notification.notifications.died_colony_notification import DiedColonyNotification

class NotificationClientSerializer():

    def __init__(self, util_client_serializer: UtilClientSerializer, death_record_client_serializer: DeathRecordClientSerializer):
        self._util_client_serializer = util_client_serializer
        self._death_record_client_serializer = death_record_client_serializer

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
            'id': notification.id,
            'step': notification.step,
            'type': notification.type
        }
            
    def _serialize_died_ant(self, notification: DiedAntNotification):
        props = self._serialize_common(notification)

        props.update({
            'antName': notification.ant_name,
            'antType': notification.ant_type,
            'isQueenOfColony': notification.is_queen_of_colony,
            'deathRecord': self._death_record_client_serializer.serialize(notification.death_record)
        })

        return props
    
    def _serialize_died_nest(self, notification: DiedNestNotification):
        props = self._serialize_common(notification)

        props.update({
            'nestName': notification.nest_name,
            'deathRecord': self._death_record_client_serializer.serialize(notification.death_record)
        })

        return props
    
    def _serialize_nest_alarm_raised(self, notification: NestAlarmRaisedNotification):
        props = self._serialize_common(notification)

        props.update({
            'nestName': notification.nest_name,
            'nestPosition': self._util_client_serializer.serialize_point(notification.nest_position)
        })

        return props
    
    
    def _serialize_nest_alarm_canceled(self, notification: NestAlarmCanceledNotification):
        props = self._serialize_common(notification)

        props.update({
            'nestName': notification.nest_name,
            'nestPosition': self._util_client_serializer.serialize_point(notification.nest_position)
        })

        return props
    
    def _serialize_died_colony(self, notification: DiedColonyNotification):
        props = self._serialize_common(notification)

        props.update({
            'colonyName': notification.colony_name,
        })

        return props
    
