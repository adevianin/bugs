from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from core.world.entities.world.birthers.requests.ladybug_birth_request import LadybugBirthRequest
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.settings import ANTS_PER_LADYBUG

class LadybugSpawner():

    ACTIVE_SEASONS = [SeasonTypes.SPRING, SeasonTypes.SUMMER]

    def __init__(self, event_bus: EventEmitter, map: Map):
        self._event_bus = event_bus
        self._map = map

        self._event_bus.add_listener('step_done', self._on_step_done)

    def _on_step_done(self, step_number: int, season: SeasonTypes):
        if step_number % 20 == 0 and season in LadybugSpawner.ACTIVE_SEASONS:
            if self._is_lack_of_bugs():
                self._spawn()

    def _spawn(self):
        pos = self._map.generate_random_point()
        self._event_bus.emit('ladybug_birth_request', LadybugBirthRequest(pos))

    def _is_lack_of_bugs(self):
        ladybugs_count = len(self._map.get_entities(entity_types=[EntityTypes.LADYBUG]))
        if ladybugs_count < 10:
            return True
        ants_count = len(self._map.get_entities(entity_types=[EntityTypes.ANT]))
        return ants_count / ladybugs_count < ANTS_PER_LADYBUG
    