from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter

class iEnemy(ABC):

    @property
    @abstractmethod
    def id(self):
        pass

    @property
    @abstractmethod
    def position(self):
        pass

    @property
    @abstractmethod
    def is_died(self):
        pass

    @property
    @abstractmethod
    def body(self):
        pass

    @property
    @abstractmethod
    def events(self) -> EventEmitter:
        pass

    @property
    @abstractmethod
    def is_detectable(self) -> bool:
        pass