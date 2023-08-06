from core.world.entities.map.map_factory import MapFactory
from core.world.entities.base.entity_collection import EntityCollection
from core.world.utils.size import Size

class JsonMapFactory():
    
    def __init__(self, map_factory: MapFactory):
        self._map_factory = map_factory

    def build_map_from_json(self, map_json, entities_collection: EntityCollection):
        size = Size(map_json['size']['width'], map_json['size']['height'])
        return self._map_factory.build_map(size, entities_collection)