from .util_client_serializer import UtilClientSerializer
from core.world.entities.world.notification.notifications.notification import Notification
from core.world.entities.world.notification.notification_types import NotificationTypes
from core.world.entities.world.notification.notifications.died_ant_notification import DiedAntNotification
from core.world.entities.world.notification.notifications.died_nest_notification import DiedNestNotification

class NotificationClientSerializer():

    def __init__(self, util_client_serializer: UtilClientSerializer):
        self._util_client_serializer = util_client_serializer

    def serialize(self, notification: Notification):

        match(notification.type):
            case NotificationTypes.DIED_ANT:
                return self._serialize_died_ant(notification)
            case NotificationTypes.DIED_NEST:
                return self._serialize_died_nest(notification)
            case _:
                raise Exception('unknown type of notification')
            
    def _serialize_common(self, notification: Notification):
        return {
            'step': notification.step
        }
            
    def _serialize_died_ant(self, notification: DiedAntNotification):
        props = self._serialize_common(notification)

        props.update({
            'antName': notification.ant_name
        })

        return props
    
    def _serialize_died_nest(self, notification: DiedNestNotification):
        props = self._serialize_common(notification)

        props.update({
            'nestPosition': notification.nest_position
        })

        return props
    
