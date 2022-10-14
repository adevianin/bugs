from .bug import Bug

class WorldFactory:

    def __init__(self, main_event_bus):
        self.main_event_bus = main_event_bus

    def buildBug(self, id, pos):
        return Bug(self.main_event_bus, id, pos)
