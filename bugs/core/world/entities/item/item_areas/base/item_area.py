from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.size import Size
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity
from core.world.entities.world.birth_requests.item_birth_request import ItemBirthRequest
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.season_types import SeasonTypes

import random
from typing import List, Dict

class ItemArea(Entity):

    ACTIVE_SEASONS: Dict[ItemTypes, List[SeasonTypes]] = {
        ItemTypes.FLOWER: [SeasonTypes.SPRING, SeasonTypes.SUMMER],
        ItemTypes.LEAF: [SeasonTypes.SUMMER, SeasonTypes.AUTUMN],
        ItemTypes.STICK: [SeasonTypes.SUMMER, SeasonTypes.AUTUMN]
    }

    @staticmethod
    def check_is_fertile_season_for_item_type(season: SeasonTypes, item_type: ItemTypes):
        fertile_seasons = ItemArea.ACTIVE_SEASONS.get(item_type, [])
        return season in fertile_seasons

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: Body, size: Size, 
                 item_type: ItemTypes, fertility: int, accumulated: int, is_active: bool):
        super().__init__(event_bus, events, id, EntityTypes.ITEM_AREA, ownership, body)
        self._size = size
        self._item_type = item_type
        self._fertility = fertility
        self._accumulated = accumulated
        self._is_active = is_active

        self._event_bus.add_listener('season_changed', self._on_season_changed)

    def _on_body_died(self, death_record: BaseDeathRecord):
        self._event_bus.remove_listener('season_changed', self._on_season_changed)
        super()._on_body_died(death_record)

    @property
    def size(self):
        return self._size
    
    @property
    def fertility(self):
        return self._fertility
    
    @property
    def is_active(self):
        return self._is_active

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def accumulated(self):
        return self._accumulated
    
    def do_step(self):
        if self._is_active:
            self._accumulated += self._fertility
            if self._should_spawn():
                self._request_birth()
                self._accumulated = 0
    
    def _generate_spawn_point(self):
        half_width = int(self._size.width / 2)
        half_height = int(self._size.height / 2)
        minX = self._body.position.x - half_width
        maxX = self._body.position.x + half_width
        x = random.randint(minX, maxX)
        minY = self._body.position.y - half_height
        maxY = self._body.position.y + half_height
        y = random.randint(minY, maxY)

        return Point(x, y)
    
    def _should_spawn(self) -> bool:
        return self._accumulated > 10 and random.choice([True, False, False, False])
    
    def _request_birth(self):
        self._event_bus.emit('item_birth_request', ItemBirthRequest(self._generate_spawn_point(), self._accumulated, self._item_type, 0))

    def _on_season_changed(self, season: SeasonTypes):
        self._is_active = ItemArea.check_is_fertile_season_for_item_type(season, self._item_type )


