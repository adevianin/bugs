from abc import ABC, abstractmethod
from typing import Dict

class iWorldDataRepository(ABC):

    @abstractmethod
    async def get(self, world_id: int):
        pass

    @abstractmethod
    async def push(self, world_id: int, data: Dict):
        pass
