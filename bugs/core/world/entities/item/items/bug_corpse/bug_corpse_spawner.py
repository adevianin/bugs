from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.map.map import Map
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.items.base.item import Item
from core.world.settings import SPAWN_BUG_CORPSES
from typing import List, Callable
import random

class BugCorpseSpawner():

    ACTIVE_SEASONS = [SeasonTypes.SUMMER, SeasonTypes.AUTUMN]

    def __init__(self, event_bus: EventEmitter, map: Map):
        self._event_bus = event_bus
        self._map = map

        self._event_bus.add_listener('step_start', self._on_step_start)

    def _on_step_start(self, step_number: int, current_season: SeasonTypes):
        if SPAWN_BUG_CORPSES and step_number % 20 == 0 and current_season in self.ACTIVE_SEASONS:
            bug_corpse_filter: Callable[[Item], bool] = lambda item: item.item_type == ItemTypes.BUG_CORPSE
            bug_corpses = self._map.get_entities(entity_types=[EntityTypes.ITEM], filter=bug_corpse_filter)
            nests: List[Nest] = self._map.get_entities(entity_types=[EntityTypes.NEST])
            nests_count = len(nests)
            bug_corpses_count = len(bug_corpses)
            if nests_count > 0 and bug_corpses_count < nests_count:
                nest = random.choice(nests)
                spawn_point = self._map.generate_random_point_on_circle(nest.position, nest.area)
                strength = random.randint(80, 200)
                self._event_bus.emit('item_birth_request', ItemBirthRequest(spawn_point, strength, ItemTypes.BUG_CORPSE, random.randint(0, 360)))

    