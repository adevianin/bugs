from abc import ABC, abstractmethod

class iEngineChannel(ABC):

    @abstractmethod
    def start(self):
        pass