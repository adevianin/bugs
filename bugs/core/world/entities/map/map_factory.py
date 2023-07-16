from core.world.utils.event_emiter import EventEmitter
from core.world.utils.size import Size
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from .map import Map

class MapFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_map(self, size: Size, id_generator: IdGenerator, entities_collection: EntityCollection):
        return Map(self._event_bus, size, entities_collection, id_generator)