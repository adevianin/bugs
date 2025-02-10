from core.world.services.base_service import BaseService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.birth_requests.ladybug_birth_request import LadybugBirthRequest
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.settings import ANTS_PER_LADYBUG, SPAWN_LADYBUGS
from core.world.utils.point import Point
from core.world.entities.tree.tree import Tree
import random

class LadybugSpawnerService(BaseService):

    ACTIVE_SEASONS = [SeasonTypes.SPRING, SeasonTypes.SUMMER]

    def __init__(self, event_bus: EventEmitter):
        super().__init__(event_bus)

        self._event_bus.add_listener('step_done', self._on_step_done)

    def _on_step_done(self, step_number: int, season: SeasonTypes):
        if SPAWN_LADYBUGS and step_number % 20 == 0 and season in LadybugSpawnerService.ACTIVE_SEASONS:
            if self._is_lack_of_bugs():
                self._spawn()

    def _spawn(self):
        pos = self._generate_spawn_point()
        self._event_bus.emit('ladybug_birth_request', LadybugBirthRequest(pos))

    def _is_lack_of_bugs(self):
        ladybugs_count = len(self._world.map.get_entities(entity_types=[EntityTypes.LADYBUG]))
        if ladybugs_count < 10:
            return True
        ants_count = len(self._world.map.get_entities(entity_types=[EntityTypes.ANT]))
        return ants_count / ladybugs_count < ANTS_PER_LADYBUG
    
    def _generate_spawn_point(self):
        trees = self._world.map.get_entities(entity_types=[EntityTypes.TREE])
        tree: Tree = random.choice(trees)
        return Point(tree.position.x, tree.position.y - 100)