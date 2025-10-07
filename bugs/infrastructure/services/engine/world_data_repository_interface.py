from abc import ABC, abstractmethod
from typing import Dict

class iWorldDataRepository(ABC):

    @abstractmethod
    def get(self, world_id: int):
        pass

    @abstractmethod
    def push(self, world_id: int, data: Dict):
        pass
