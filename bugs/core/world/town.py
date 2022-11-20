from .entity import Entity
from .entity_types import EntityTypes
from .size import Size

class Town(Entity):

    def __init__(self, main_event_bus, id, pos):
        super().__init__(main_event_bus, EntityTypes.TOWN, id, pos, Size(100, 100))
