from core.world.entities.base.entity_collection import EntityCollection
from .base.live_entity_desrializer import LiveEntityDeserializer
from core.world.entities.ladybug.ladybug_factory import LadybugFactory

class LadybugDeserializer(LiveEntityDeserializer):

    def __init__(self, ladybug_factory: LadybugFactory):
        self._ladybug_factory = ladybug_factory

    def deserialize(self, json: dict, entities_collection: EntityCollection):
        props = self._parse_ladybug_props(json)
        return self._ladybug_factory.build_ladybug(**props)
    
    def _parse_ladybug_props(self, json: dict):
        props = self.parse_live_entity_props(json)
        return props
