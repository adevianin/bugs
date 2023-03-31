from abc import ABC, abstractclassmethod

class iWorldDataRepository(ABC):

    @abstractclassmethod
    def get(self, world_id: int):
        pass

    @abstractclassmethod
    def push(self, world_id: int, data: dict):
        pass