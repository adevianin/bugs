from .entity import Entity
from .entity_types import EntityTypes
from .size import Size

class Town(Entity):

    def __init__(self, main_event_bus, id, pos, color):
        super().__init__(main_event_bus, EntityTypes.TOWN, id, pos, Size(100, 100))
        self._color = color

    def get_color(self):
        return self._color

    def to_json(self):
        json = super().to_json()
        json.update({
            'color': self._color
        })
        return json
