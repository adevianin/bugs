from .bug import Bug

class WorldFactory:
    def buildBug(self, id, pos):
        return Bug(id, pos)
