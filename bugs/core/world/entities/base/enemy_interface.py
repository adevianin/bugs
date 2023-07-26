from abc import ABC, abstractmethod

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

    @abstractmethod
    def damage(self, damage: int):
        pass