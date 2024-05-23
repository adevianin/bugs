from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypesPack
from core.world.entities.base.entity import Entity

class VisualSensorHandler():

    def __init__(self, event_bus: EventEmitter, map: Map):
        self._event_bus = event_bus
        self._map = map

        self._event_bus.add_listener('entity_born', self._on_entity_born)

        self._setup_sensors()

    def handle_sensors(self):
        live_entities = self._map.get_live_entities()
        for entity in live_entities:
            entities_in_sight = self._map.find_entities_near(point=entity.position, max_distance=entity.body.stats.sight_distance, filter=lambda checking_entity: entity.id != checking_entity.id)
            entity.body.visual_sensor.set_nearby_entities(entities_in_sight)

    def _setup_sensors(self):
        live_entities = self._map.get_live_entities()
        for entity in live_entities:
            self._setup_sensor_for_entity(entity)

    def _setup_sensor_for_entity(self, entity: LiveEntity):
        entity.body.visual_sensor.set_map_size(self._map.size)

    def _on_entity_born(self, entity: Entity):
        if (entity.type in EntityTypesPack.LIVE_ENTITIES):
            self._setup_sensor_for_entity(entity)