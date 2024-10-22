from core.world.entities.world.notification.notification_types import NotificationTypes
from core.world.utils.point import Point
from core.world.entities.world.notification.notifications.died_ant_notification import DiedAntNotification
from core.world.entities.world.notification.notifications.died_nest_notification import DiedNestNotification

class NotificationDeserializer():

    def deserialize(self, json: dict):
        type = NotificationTypes(json['type'])

        match(type):
            case NotificationTypes.DIED_ANT:
                return self._build_died_ant_notification(json)
            case NotificationTypes.DIED_NEST:
                return self._build_died_nest_notification(json)
            case _:
                raise Exception('unknown type of notification')
            
    def _build_died_ant_notification(self, json: dict):
        return DiedAntNotification(json['owner_id'], json['ant_name'], json['step'])
    
    def _build_died_nest_notification(self, json: dict):
        nest_position = Point.from_json(json['nest_position'])
        return DiedNestNotification(json['owner_id'], nest_position, json['step'])