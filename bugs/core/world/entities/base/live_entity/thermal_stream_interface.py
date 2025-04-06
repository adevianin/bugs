from abc import ABC, abstractmethod

class iThermalStream(ABC):

    @property
    @abstractmethod
    def daily_temperature(self):
        pass

    @property
    @abstractmethod
    def direction_of_change(self):
        pass