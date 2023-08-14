from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from core.world.utils.point import Point
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle

import random

class GroundBeetleSpawner():

    def __init__(self, event_bus: EventEmitter, map: Map):
        self._event_bus = event_bus
        self._map = map

        self._event_bus.add_listener('step_start', self._on_step_start)

    def _on_step_start(self, step_number):
        if self._should_spawn():
            pos = self._generate_spawn_position()
            self._event_bus.emit('birth_request', {
                'entity_type': EntityTypes.GROUND_BEETLE,
                'position': pos
            })

    def _should_spawn(self) -> bool:
        return random.random() < 0.2
    
    def _generate_spawn_position(self) -> Point:
        # return Point(800, 400)
        x = random.randint(10, 500)
        y = random.randint(10, 500)
        return Point(x, y)