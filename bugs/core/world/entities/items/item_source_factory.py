from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.items.base.item_types import ItemTypes
from core.world.entities.items.base.item_source import ItemSource

class ItemSourceFactory():

    def build_item_source(self, id: int, from_colony_id: int, hp: int, position: Point, item_type: ItemTypes, fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int):
        events = EventEmitter()
        return ItemSource(events, id, from_colony_id, hp, position, item_type, fertility, accumulated, min_item_strength, max_item_strength)