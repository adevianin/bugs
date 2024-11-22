from enum import StrEnum

class ItemTypes(StrEnum):
    LEAF = 'leaf'
    STICK = 'stick'
    FLOWER = 'flower'
    HONEYDEW = 'honeydew'
    BUG_CORPSE = 'bug_corpse'
    ANT_FOOD = 'ant_food'

class ItemTypesPack():
    BUILDING_ITEMS = [ItemTypes.LEAF, ItemTypes.STICK]