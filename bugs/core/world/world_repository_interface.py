from abc import ABC, abstractclassmethod
from core.world.entities.world.world import World

class iWorldRepository(ABC):

    @abstractclassmethod
    def get(self, world_id: int) -> World:
        pass

    @abstractclassmethod
    def push(self, world: World, world_id: int):
        pass