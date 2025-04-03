from core.world.entities.world.notification.notification_types import NotificationTypes
import uuid

class Notification():

    def __init__(self, owner_id: int, step: int, type: NotificationTypes):
        self._id = str(uuid.uuid4())
        self._owner_id = owner_id
        self._step = step
        self._type = type

    @property
    def id(self):
        return self._id

    @property
    def owner_id(self):
        return self._owner_id

    @property
    def step(self):
        return self._step
    
    @step.setter
    def step(self, step: int):
        self._step = step

    @property
    def type(self):
        return self._type