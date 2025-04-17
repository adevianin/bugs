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
from core.world.entities.item.items.ant_food.ant_food_item import AntFoodItem
from core.world.entities.item.items.ant_food.ant_food_item_body import AntFoodItemBody
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.item.items.stick_item.stick_item import StickItem
from core.world.entities.item.items.stick_item.stick_item_body import StickItemBody
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.item.items.bug_corpse.bug_corpse_item import BugCorpseItem
from core.world.entities.item.items.bug_corpse.bug_corpse_item_body import BugCorpseItemBody
from .nectar_item.nectar_item import NectarItem
from .nectar_item.nectar_item_body import NectarItemBody
from core.world.entities.world.id_generator import IdGenerator
from core.world.exceptions import GameError
from core.world.settings import (BUG_CORPSE_ITEM_LIFE_SPAN, FLOWER_ITEM_LIFE_SPAN, LEAF_ITEM_LIFE_SPAN, HONEYDEW_ITEM_LIFE_SPAN, NECTAR_ITEM_LIFE_SPAN, 
                                 ANT_FOOD_ITEM_LIFE_SPAN, STICK_ITEM_LIFE_SPAN)
import random

class ItemFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_item(self, item_type: ItemTypes, position: Point, strength: int, angle: int, birth_step: int) -> Item:
        id = IdGenerator.generate_id()
        ownership = OwnershipConfig(None, None)
        hp = StatsLibrary.GHOST_DEFAULT.max_hp
        die_step = birth_step + self._get_life_span_for_item_type(item_type)
        return self.build_item(id, item_type, position, angle, strength, None, die_step, False, ownership, hp)
    
    def build_item(self, id: int, item_type: ItemTypes, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, 
                   ownership: OwnershipConfig, hp: int) -> Item:
        match (item_type):
            case ItemTypes.FLOWER:
                return self._build_flower_item(id, position, angle, strength, variety, die_step, is_picked, ownership, hp)
            case ItemTypes.LEAF:
                return self._build_leaf_item(id, position, angle, strength, variety, die_step, is_picked, ownership, hp)
            case ItemTypes.HONEYDEW:
                return self._build_honeydew_item(id, position, angle, strength, variety, die_step, is_picked, ownership, hp)
            case ItemTypes.ANT_FOOD:
                return self._build_ant_food_item(id, position, angle, strength, variety, die_step, is_picked, ownership, hp)
            case ItemTypes.STICK:
                return self._build_stick_item(id, position, angle, strength, variety, die_step, is_picked, ownership, hp)
            case ItemTypes.BUG_CORPSE:
                return self._build_bug_corpse_item(id, position, angle, strength, variety, die_step, is_picked, ownership, hp)
            case ItemTypes.NECTAR:
                return self._build_nectar_item(id, position, angle, strength, variety, die_step, is_picked, ownership, hp)
            case _:
                raise GameError('unknown item type')

    def _build_flower_item(self, id: int, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, ownership: OwnershipConfig,
                           hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = FlowerItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(FlowerItemBody.VARIETY_COUNT)
        return FlowerItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, die_step, is_picked)
    
    def _build_leaf_item(self, id: int, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, ownership: OwnershipConfig, 
                         hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = LeafItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(LeafItemBody.VARIETY_COUNT)
        return LeafItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, die_step, is_picked)
    
    def _build_honeydew_item(self, id: int, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, ownership: OwnershipConfig, 
                             hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = HoneydewItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(HoneydewItemBody.VARIETY_COUNT)
        return HoneydewItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, die_step, is_picked)
    
    def _build_ant_food_item(self, id: int, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, ownership: OwnershipConfig, hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = AntFoodItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(AntFoodItemBody.VARIETY_COUNT)
        return AntFoodItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, die_step, is_picked)
    
    def _build_stick_item(self, id: int, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, ownership: OwnershipConfig, hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = StickItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(StickItemBody.VARIETY_COUNT)
        return StickItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, die_step, is_picked)
    
    def _build_bug_corpse_item(self, id: int, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, ownership: OwnershipConfig, hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = BugCorpseItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(BugCorpseItemBody.VARIETY_COUNT)
        return BugCorpseItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, die_step, is_picked)
    
    def _build_nectar_item(self, id: int, position: Point, angle: int, strength: int, variety: int, die_step: int, is_picked: bool, ownership: OwnershipConfig, hp: int):
        stats = StatsLibrary.GHOST_DEFAULT
        body = NectarItemBody(EventEmitter(), stats, position, angle, hp)
        variety = variety or self._generate_variety(NectarItemBody.VARIETY_COUNT)
        return NectarItem(self._event_bus, EventEmitter(), id, body, ownership, strength, variety, die_step, is_picked)
    
    def _generate_variety(self, variety_count: int):
        return random.randint(1, variety_count)
    
    def _get_life_span_for_item_type(self, item_type: ItemTypes):
        match (item_type):
            case ItemTypes.FLOWER:
                return FLOWER_ITEM_LIFE_SPAN
            case ItemTypes.LEAF:
                return LEAF_ITEM_LIFE_SPAN
            case ItemTypes.HONEYDEW:
                return HONEYDEW_ITEM_LIFE_SPAN
            case ItemTypes.ANT_FOOD:
                return ANT_FOOD_ITEM_LIFE_SPAN
            case ItemTypes.STICK:
                return STICK_ITEM_LIFE_SPAN
            case ItemTypes.BUG_CORPSE:
                return BUG_CORPSE_ITEM_LIFE_SPAN
            case ItemTypes.NECTAR:
                return NECTAR_ITEM_LIFE_SPAN