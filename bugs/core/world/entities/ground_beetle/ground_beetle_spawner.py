from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from core.world.entities.world.birthers.requests.ground_beetle_birth_request import GroundBeetleBirthRequest
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.settings import ANTS_PER_GROUND_BEETLE

class GroundBeetleSpawner():

    ACTIVE_SEASONS = [SeasonTypes.SPRING, SeasonTypes.SUMMER]

    def __init__(self, event_bus: EventEmitter, map: Map):
        self._event_bus = event_bus
        self._map = map

        self._event_bus.add_listener('step_done', self._on_step_done)

    def _on_step_done(self, step_number: int, season: SeasonTypes):
        if step_number % 20 == 0 and season in GroundBeetleSpawner.ACTIVE_SEASONS:
            if self._is_lack_of_beetles():
                self._spawn()

    def _spawn(self):
        pos = self._map.generate_random_point()
        self._event_bus.emit('ground_beetle_birth_request', GroundBeetleBirthRequest.build(pos))

    def _is_lack_of_beetles(self):
        beetles_count = len(self._map.get_entities(entity_types=[EntityTypes.GROUND_BEETLE]))
        if beetles_count == 0:
            return True
        ants_count = len(self._map.get_entities(entity_types=[EntityTypes.ANT]))
        return ants_count / beetles_count < ANTS_PER_GROUND_BEETLE
    