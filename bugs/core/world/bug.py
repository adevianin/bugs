import json
from .entity import Entity

class Bug(Entity):
    def __init__(self, id, pos):
        super().__init__(id, pos)

    def toJSON(self):
        json = super().toJSON()
        json.update({

        })
        return json
