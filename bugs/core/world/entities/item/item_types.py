from enum import StrEnum

class ItemTypes(StrEnum):
    LEAF = 'leaf'
    FLOWER = 'flower'
    HONEYDEW = 'honeydew'
    GROUND_BEETLE_CORPSE = 'ground_beetle_corpse'

class ItemTypesPack():
    ANT_EDIBLE_ITEMS = [ItemTypes.GROUND_BEETLE_CORPSE]