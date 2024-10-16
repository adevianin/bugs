from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory
from .base.live_entity_desrializer import LiveEntityDeserializer

class GroundBeetleDeserializer(LiveEntityDeserializer):

    def __init__(self, ground_beetle_factory: GroundBeetleFactory):
        self._ground_beetle_factory = ground_beetle_factory

    def deserialize_ground_beetle(self, ground_beetle_json: dict, entities_collection: EntityCollection):
        props = self._parse_ground_beetle_props(ground_beetle_json)
        return self._ground_beetle_factory.build_ground_beetle(**props)
    
    def _parse_ground_beetle_props(self, json: dict):
        props = self.parse_live_entity_props(json)
        return props
