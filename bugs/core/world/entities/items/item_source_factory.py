from .item_sources.honeydew_item_source import HoneydewItemSource
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.items.base.item_types import ItemTypes

class ItemSourceFactory():

    def build_item_source(self, id: int, from_colony_id: int, hp: int, position: Point, item_type: ItemTypes, fertility: int, accumulated: int):
        events = EventEmitter()
        match(item_type):
            case ItemTypes.HONEYDEW:
                return HoneydewItemSource(events, id, from_colony_id, hp, position, item_type, fertility, accumulated)
            case _:
                raise Exception('unknown source item type')