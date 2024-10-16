from .ground_beetle_corpse_item_body import GroundBeetleCorpseItemBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.ownership_config import OwnershipConfig

class GroundBeetleCorpseItem(Item):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, body: GroundBeetleCorpseItemBody, ownership: OwnershipConfig, strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(event_bus, events, id, body, ItemTypes.GROUND_BEETLE_CORPSE, ownership, strength, variety, life_span, is_picked)