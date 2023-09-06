from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.item_types import ItemTypes
from core.world.entities.item.item_source.item_source import ItemSource
from .item_source_body import ItemSourceBody

class ItemSourceFactory():

    def build_item_source(self, id: int, from_colony_id: int, hp: int, position: Point, angle: int, item_type: ItemTypes, fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int):
        events = EventEmitter()
        body = ItemSourceBody(events, position, angle, hp)
        return ItemSource(events, id, from_colony_id, body, item_type, fertility, accumulated, min_item_strength, max_item_strength)