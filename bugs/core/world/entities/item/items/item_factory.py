from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from .base.item import Item
from core.world.entities.item.items.flower_item.flower_item import FlowerItem
from core.world.entities.item.items.flower_item.flower_item_body import FlowerItemBody
from core.world.entities.item.items.leaf_item.leaf_item import LeafItem
from core.world.entities.item.items.leaf_item.leaf_item_body import LeafItemBody
from core.world.entities.item.items.honeydew_item.honeydew_item import HoneydewItem
from core.world.entities.item.items.honeydew_item.honeydew_item_body import HoneydewItemBody
from core.world.entities.item.items.ground_beetle_corpse_item.ground_beetle_corpse_item import GroundBeetleCorpseItem
from core.world.entities.item.items.ground_beetle_corpse_item.ground_beetle_corpse_item_body import GroundBeetleCorpseItemBody
from core.world.entities.item.items.ant_food.ant_food_item import AntFoodItem
from core.world.entities.item.items.ant_food.ant_food_item_body import AntFoodItemBody


import random

class ItemFactory():

    def build_new_item(self, id: int, item_type: ItemTypes, position: Point, strength: int) -> Item:
        return self.build_item(id, item_type, position, 0, strength, None, None, False)

    def build_item(self, id: int, item_type: ItemTypes, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool) -> Item:
        match (item_type):
            case ItemTypes.FLOWER:
                return self._build_flower_item(id, position, angle, strength, variety, life_span, is_picked)
            case ItemTypes.LEAF:
                return self._build_leaf_item(id, position, angle, strength, variety, life_span, is_picked)
            case ItemTypes.HONEYDEW:
                return self._build_honeydew_item(id, position, angle, strength, variety, life_span, is_picked)
            case ItemTypes.GROUND_BEETLE_CORPSE:
                return self._build_ground_beetle_corpse_item(id, position, angle, strength, variety, life_span, is_picked)
            case ItemTypes.ANT_FOOD:
                return self._build_ant_food_item(id, position, angle, strength, variety, life_span, is_picked)

    def _build_flower_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool):
        events = EventEmitter()
        body = FlowerItemBody(events, {}, position, angle, FlowerItemBody.MAX_HP)
        variety = variety or self._generate_variety(FlowerItemBody.VARIETY_COUNT)
        life_span = life_span or FlowerItemBody.LIFE_SPAN
        return FlowerItem(events, id, body, strength, variety, life_span, is_picked)
    
    def _build_leaf_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool):
        events = EventEmitter()
        body = LeafItemBody(events, {}, position, angle, LeafItemBody.MAX_HP)
        variety = variety or self._generate_variety(LeafItemBody.VARIETY_COUNT)
        life_span = life_span or LeafItemBody.LIFE_SPAN
        return LeafItem(events, id, body, strength, variety, life_span, is_picked)
    
    def _build_honeydew_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool):
        events = EventEmitter()
        body = HoneydewItemBody(events, {}, position, angle, HoneydewItemBody.MAX_HP)
        variety = variety or self._generate_variety(HoneydewItemBody.VARIETY_COUNT)
        life_span = life_span or HoneydewItemBody.LIFE_SPAN
        return HoneydewItem(events, id, body, strength, variety, life_span, is_picked)
    
    def _build_ground_beetle_corpse_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool):
        events = EventEmitter()
        body = GroundBeetleCorpseItemBody(events, {}, position, angle, GroundBeetleCorpseItemBody.MAX_HP)
        variety = variety or self._generate_variety(GroundBeetleCorpseItemBody.VARIETY_COUNT)
        life_span = life_span or GroundBeetleCorpseItemBody.LIFE_SPAN
        return GroundBeetleCorpseItem(events, id, body, strength, variety, life_span, is_picked)
    
    def _build_ant_food_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool):
        events = EventEmitter()
        body = AntFoodItemBody(events, {}, position, angle, AntFoodItemBody.MAX_HP)
        variety = variety or self._generate_variety(AntFoodItemBody.VARIETY_COUNT)
        life_span = life_span or AntFoodItemBody.LIFE_SPAN
        return AntFoodItem(events, id, body, strength, variety, life_span, is_picked)
    
    def _generate_variety(self, variety_count: int):
        return random.randint(1, variety_count)