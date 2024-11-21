from enum import StrEnum

class EntityTypes(StrEnum):
    ANT = 'ant'
    LADYBUG = 'ladybug'
    NEST = 'nest'
    ITEM = 'item'
    ITEM_SOURCE = 'item_source'
    ITEM_AREA = 'item_area'
    TREE = 'tree'

class EntityTypesPack():
    LIVE_ENTITIES = [EntityTypes.ANT, EntityTypes.LADYBUG]