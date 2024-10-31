from .stick_item_body import StickItemBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.ownership_config import OwnershipConfig

class StickItem(Item):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, body: StickItemBody, ownership: OwnershipConfig, is_removal_blocked: bool,
                 strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(event_bus, events, id, body, ItemTypes.STICK, ownership, is_removal_blocked, strength, variety, life_span, is_picked)