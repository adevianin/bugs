from .leaf_item_body import LeafItemBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.ownership_config import OwnershipConfig

class LeafItem(Item):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, body: LeafItemBody, ownership: OwnershipConfig,
                 strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(event_bus, events, id, body, ItemTypes.LEAF, ownership, strength, variety, life_span, is_picked)