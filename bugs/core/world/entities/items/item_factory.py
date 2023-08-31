from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .items.leaf_item import LeafItem
from .items.honeydew_item import HoneydewItem
from .items.flower_item import FlowerItem

class ItemFactory():

    def build_honeydew_item(self, id: int, position: Point, is_picked: bool = False, item_variety: int = None, calories: int = 0):
        events = EventEmitter()
        is_picked = is_picked if is_picked else False
        item_variety = item_variety if item_variety else HoneydewItem.generate_random_item_variety()
        return HoneydewItem(events, id, position, is_picked, item_variety, calories)

    def build_leaf_item(self, id: int, position: Point, is_picked: bool = False, item_variety: int = None, calories: int = 0):
        events = EventEmitter()
        is_picked = is_picked if is_picked else False
        item_variety = item_variety if item_variety else LeafItem.generate_random_item_variety()
        return LeafItem(events, id, position, is_picked, item_variety, calories)
    
    def build_flower_item(self, id: int, position: Point, is_picked: bool = False, item_variety: int = None):
        events = EventEmitter()
        is_picked = is_picked if is_picked else False
        item_variety = item_variety if item_variety else FlowerItem.generate_random_item_variety()
        return FlowerItem(events, id, position, is_picked, item_variety)