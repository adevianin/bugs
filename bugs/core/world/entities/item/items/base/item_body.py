from abc import abstractclassmethod
from core.world.entities.base.body import Body

class ItemBody(Body):
    LIFE_SPAN = 50
    VARIETY_COUNT = 1