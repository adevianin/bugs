from enum import StrEnum

class EntityTypes(StrEnum):
    ANT = 'ant'
    GROUND_BEETLE = 'ground_beetle'
    FOOD = 'food'
    NEST = 'nest'
    FOOD_AREA = 'food_area'
    FOOD_SOURCE = 'food_source'

class EntityTypesPack():
    LIVE_ENTITIES = [EntityTypes.ANT, EntityTypes.GROUND_BEETLE]