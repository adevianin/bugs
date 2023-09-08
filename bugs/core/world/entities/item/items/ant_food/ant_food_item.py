from .ant_food_item_body import AntFoodItemBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item

class AntFoodItem(Item):

    def __init__(self, events: EventEmitter, id: int, body: AntFoodItemBody, strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(events, id, body, ItemTypes.ANT_FOOD, strength, variety, life_span, is_picked)