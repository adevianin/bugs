from core.world.services.base_service import BaseService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.birth_requests.item_birth_request import ItemBirthRequest
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.items.base.item import Item
from core.world.settings import SPAWN_BUG_CORPSES
from typing import List, Callable
import random

class BugCorpseSpawnerService(BaseService):

    MIN_DISTANCE_TO_NEST = 100
    ACTIVE_SEASONS = [SeasonTypes.SUMMER, SeasonTypes.AUTUMN]

    def __init__(self, event_bus: EventEmitter):
        super().__init__(event_bus)

        self._event_bus.add_listener('step_start', self._on_step_start)

    def _on_step_start(self, step_number: int, current_season: SeasonTypes):
        if SPAWN_BUG_CORPSES and step_number % 20 == 0 and current_season in self.ACTIVE_SEASONS:
            bug_corpse_filter: Callable[[Item], bool] = lambda item: item.item_type == ItemTypes.BUG_CORPSE
            bug_corpses = self._world.map.get_entities(entity_types=[EntityTypes.ITEM], filter=bug_corpse_filter)
            nests: List[Nest] = self._world.map.get_entities(entity_types=[EntityTypes.NEST])
            nests_count = len(nests)
            bug_corpses_count = len(bug_corpses)
            if nests_count > 0 and bug_corpses_count < nests_count:
                nest = random.choice(nests)
                # nest = self._world.map.get_entity_by_id(622)
                spawn_point = self._world.map.generate_random_point_within_circle(nest.position, nest.area, self.MIN_DISTANCE_TO_NEST)
                strength = random.randint(80, 200)
                self._event_bus.emit('item_birth_request', ItemBirthRequest(spawn_point, strength, ItemTypes.BUG_CORPSE, random.randint(0, 360)))