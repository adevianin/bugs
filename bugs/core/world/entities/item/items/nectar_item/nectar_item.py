from .nectar_item_body import NectarItemBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.ownership_config import OwnershipConfig

class NectarItem(Item):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, body: NectarItemBody, ownership: OwnershipConfig, 
                 strength: int, variety: int, die_step: int, is_picked: bool):
        super().__init__(event_bus, events, id, body, ItemTypes.NECTAR, ownership, strength, variety, die_step, is_picked)