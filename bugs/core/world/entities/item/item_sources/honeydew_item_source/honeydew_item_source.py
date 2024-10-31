from .honeydew_item_source_body import HoneydewItemSourceBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.base.ownership_config import OwnershipConfig

class HoneydewItemSource(ItemSource):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: HoneydewItemSourceBody, 
                 fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int):
        super().__init__(event_bus, events, id, ownership, body, ItemTypes.HONEYDEW, fertility, accumulated, min_item_strength, max_item_strength)