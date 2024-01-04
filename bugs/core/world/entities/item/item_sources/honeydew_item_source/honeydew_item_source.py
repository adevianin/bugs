from .honeydew_item_source_body import HoneydewItemSourceBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.item_sources.base.item_source import ItemSource

class HoneydewItemSource(ItemSource):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, body: HoneydewItemSourceBody, fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int):
        super().__init__(event_bus, events, id, from_colony_id, body, ItemTypes.HONEYDEW, fertility, accumulated, min_item_strength, max_item_strength)