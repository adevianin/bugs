from abc import ABC, abstractmethod

class iEnemy(ABC):

    @property
    @abstractmethod
    def position(self):
        pass

    @abstractmethod
    def damage(self, damage: int):
        pass