from abc import ABC, abstractclassmethod

class iWorldDataRepository(ABC):

    @abstractclassmethod
    def get(self):
        pass

    @abstractclassmethod
    def push(self, data):
        pass