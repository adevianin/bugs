from core.world.services.base_service import BaseService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.birth_requests.ladybug_birth_request import LadybugBirthRequest
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.settings import SPAWN_LADYBUGS, LADYBUG_SPAWN_STEP_FREQUENCY, LADYBUG_SPAWN_SEASONS, MIN_LADYBUG_COUNT
from core.world.utils.point import Point
from core.world.entities.tree.tree import Tree
import random

class LadybugSpawnerService(BaseService):

    def __init__(self, event_bus: EventEmitter):
        super().__init__(event_bus)

        self._event_bus.add_listener('step_done', self._on_step_done)

    def _on_step_done(self, step_number: int, season: SeasonTypes):
        if SPAWN_LADYBUGS and step_number % LADYBUG_SPAWN_STEP_FREQUENCY == 0 and season in LADYBUG_SPAWN_SEASONS:
            self._regulate_ladybugs_count()

    def _regulate_ladybugs_count(self):
        ladybugs = self._world.map.get_entities(entity_types=[EntityTypes.LADYBUG])
        ladybugs_count = len(ladybugs)
        ants_count = len(self._world.map.get_entities(entity_types=[EntityTypes.ANT]))
        min_ladybugs_count = max(int(ants_count * 0.7), MIN_LADYBUG_COUNT)
        max_ladybugs_count = int(ants_count * 1.3)

        if ladybugs_count < min_ladybugs_count:
            pos = self._generate_spawn_point()
            self._event_bus.emit('ladybug_birth_request', LadybugBirthRequest(pos))
        elif ladybugs_count > max_ladybugs_count:
            ladybug_to_die = random.choice(ladybugs)
            ladybug_to_die.simple_die()
    
    def _generate_spawn_point(self):
        trees = self._world.map.get_entities(entity_types=[EntityTypes.TREE])
        tree: Tree = random.choice(trees)
        return Point(tree.position.x, max(0, tree.position.y - 100))