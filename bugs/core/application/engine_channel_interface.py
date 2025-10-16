from abc import ABC, abstractmethod
from typing import Dict
from core.world.utils.event_emiter import EventEmitter

class iEngineChannel(ABC):

    @property
    @abstractmethod
    def events(self) -> EventEmitter:
        pass

    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def stop(self):
        pass

    @abstractmethod
    def send_engine_status(self, is_world_inited: bool, is_world_stepping: bool, players_online: int):
        pass

    @abstractmethod
    def send_msg(self, type: str, data: Dict):
        pass