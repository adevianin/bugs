from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.size import Size
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest

import random

class ItemArea(Entity):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, body: Body, size: Size, item_type: ItemTypes, fertility: int, accumulated: int):
        super().__init__(event_bus, events, id, EntityTypes.ITEM_AREA, from_colony_id, None, body)
        self._size = size
        self._item_type = item_type
        self._fertility = fertility
        self._accumulated = accumulated

    @property
    def size(self):
        return self._size
    
    @property
    def fertility(self):
        return self._fertility

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def accumulated(self):
        return self._accumulated
    
    def do_step(self):
        self._accumulated += self._fertility
        if self._should_spawn():
            self._request_birth()
            self._accumulated = 0
    
    def _generate_spawn_point(self):
        half_width = self._size.width / 2
        half_height = self._size.height / 2
        minX = self._body.position.x - half_width if self._body.position.x - half_width > 0 else 0
        maxX = self._body.position.x + half_width
        x = random.randint(minX, maxX)
        minY = self._body.position.y - half_height if self._body.position.y - half_height > 0 else 0
        maxY = self._body.position.y + half_height
        y = random.randint(minY, maxY)

        return Point(x, y)
    
    def _should_spawn(self) -> bool:
        return self._accumulated > 5 and random.choice([True, False, False, False])
    
    def _request_birth(self):
        self._event_bus.emit('item_birth_request', ItemBirthRequest.build(self._generate_spawn_point(), self._accumulated, self._item_type))

