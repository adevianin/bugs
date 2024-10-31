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
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.item.items.stick_item.stick_item import StickItem
from core.world.entities.item.items.stick_item.stick_item_body import StickItemBody
from core.world.entities.base.ownership_config import OwnershipConfig

import random

class ItemFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_item(self, id: int, item_type: ItemTypes, position: Point, strength: int) -> Item:
        ownership = OwnershipConfig(None, None)
        hp = StatsLibrary.GHOST_DEFAULT.max_hp
        return self.build_item(id, item_type, position, 0, strength, None, None, False, ownership, hp)

    def build_item(self, id: int, item_type: ItemTypes, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool, 
                   ownership: OwnershipConfig, hp: int) -> Item:
        match (item_type):
            case ItemTypes.FLOWER:
                return self._build_flower_item(id, position, angle, strength, variety, life_span, is_picked, ownership, hp)
            case ItemTypes.LEAF:
                return self._build_leaf_item(id, position, angle, strength, variety, life_span, is_picked, ownership, hp)
            case ItemTypes.HONEYDEW:
                return self._build_honeydew_item(id, position, angle, strength, variety, life_span, is_picked, ownership, hp)
            case ItemTypes.GROUND_BEETLE_CORPSE:
                return self._build_ground_beetle_corpse_item(id, position, angle, strength, variety, life_span, is_picked, ownership, hp)
            case ItemTypes.ANT_FOOD:
                return self._build_ant_food_item(id, position, angle, strength, variety, life_span, is_picked, ownership, hp)
            case ItemTypes.STICK:
                return self._build_stick_item(id, position, angle, strength, variety, life_span, is_picked, ownership, hp)
            case _:
                raise Exception('unknown item type')

    def _build_flower_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool, ownership: OwnershipConfig,
                           hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = FlowerItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(FlowerItemBody.VARIETY_COUNT)
        life_span = life_span or FlowerItemBody.LIFE_SPAN
        return FlowerItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, life_span, is_picked)
    
    def _build_leaf_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool, ownership: OwnershipConfig, 
                         hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = LeafItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(LeafItemBody.VARIETY_COUNT)
        life_span = life_span or LeafItemBody.LIFE_SPAN
        return LeafItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, life_span, is_picked)
    
    def _build_honeydew_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool, ownership: OwnershipConfig, 
                             hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = HoneydewItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(HoneydewItemBody.VARIETY_COUNT)
        life_span = life_span or HoneydewItemBody.LIFE_SPAN
        return HoneydewItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, life_span, is_picked)
    
    def _build_ground_beetle_corpse_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool, ownership: OwnershipConfig,
                                         hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = GroundBeetleCorpseItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(GroundBeetleCorpseItemBody.VARIETY_COUNT)
        life_span = life_span or GroundBeetleCorpseItemBody.LIFE_SPAN
        return GroundBeetleCorpseItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, life_span, is_picked)
    
    def _build_ant_food_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool, ownership: OwnershipConfig, hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = AntFoodItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(AntFoodItemBody.VARIETY_COUNT)
        life_span = life_span or AntFoodItemBody.LIFE_SPAN
        return AntFoodItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, life_span, is_picked)
    
    def _build_stick_item(self, id: int, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool, ownership: OwnershipConfig, hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = StickItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(StickItemBody.VARIETY_COUNT)
        life_span = life_span or StickItemBody.LIFE_SPAN
        return StickItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, life_span, is_picked)
    
    def _generate_variety(self, variety_count: int):
        return random.randint(1, variety_count)
    