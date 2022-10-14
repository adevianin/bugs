import json
from .entity import Entity

class Bug(Entity):
    def __init__(self, id, pos):
        super().__init__(id, pos)

    def toJSON(self):
        return {
            "pos": json.dumps(self.pos)
        }
