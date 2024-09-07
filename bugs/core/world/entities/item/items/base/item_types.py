from enum import StrEnum

class ItemTypes(StrEnum):
    LEAF = 'leaf'
    STICK = 'stick'
    FLOWER = 'flower'
    HONEYDEW = 'honeydew'
    GROUND_BEETLE_CORPSE = 'ground_beetle_corpse'
    ANT_FOOD = 'ant_food'

class ItemTypesPack():
    ANT_EDIBLE_ITEMS = [ItemTypes.GROUND_BEETLE_CORPSE]
    BUILDING_ITEMS = [ItemTypes.LEAF, ItemTypes.STICK]