from enum import StrEnum

class EntityTypes(StrEnum):
    ANT = 'ant'
    GROUND_BEETLE = 'ground_beetle'
    NEST = 'nest'
    ITEM = 'item'
    ITEM_SOURCE = 'item_source'
    ITEM_AREA = 'item_area'

class EntityTypesPack():
    LIVE_ENTITIES = [EntityTypes.ANT, EntityTypes.GROUND_BEETLE]
    NOT_LIVE_ENTITIES = [EntityTypes.NEST, EntityTypes.ITEM, EntityTypes.ITEM_SOURCE, EntityTypes.ITEM_AREA]