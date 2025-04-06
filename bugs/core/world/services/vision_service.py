from .base_service import BaseService
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypesPack
from core.world.entities.base.entity import Entity

class VisionService(BaseService):

    def __init__(self, event_bus):
        super().__init__(event_bus)

        self._event_bus.add_listener('entity_born', self._on_entity_born)

    def set_world(self, world):
        super().set_world(world)
        self._setup_sensors()

    def _setup_sensors(self):
        live_entities = self._world.map.get_live_entities()
        for entity in live_entities:
            self._setup_sensor_for_entity(entity)

    def _setup_sensor_for_entity(self, entity: LiveEntity):
        entity.visual_sensor.set_map_size(self._world.map.size)
        entity.visual_sensor.set_sight_distance(entity.body.stats.sight_distance)
        entity.visual_sensor.set_vision_stream(self._world.map)

    def _on_entity_born(self, entity: Entity):
        if (entity.type in EntityTypesPack.LIVE_ENTITIES):
            self._setup_sensor_for_entity(entity)