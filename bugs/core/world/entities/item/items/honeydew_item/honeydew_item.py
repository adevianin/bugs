from .honeydew_item_body import HoneydewItemBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item

class HoneydewItem(Item):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, body: HoneydewItemBody, strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(event_bus, events, id, body, ItemTypes.HONEYDEW, strength, variety, life_span, is_picked)