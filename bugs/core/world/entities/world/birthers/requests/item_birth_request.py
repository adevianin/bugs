from typing import Any, Callable
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from .birth_request import BirthRequest
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes

class ItemBirthRequest(BirthRequest):

    @classmethod
    def build(cls, position: Point, strength: int, item_type: ItemTypes, preborn_callback: Callable[[Entity], Any] = None, callback: Callable[[Entity], Any] = None):
        return ItemBirthRequest(position, strength, item_type, preborn_callback, callback)

    def __init__(self, position: Point, strength: int, item_type: ItemTypes, preborn_callback: Callable[[Entity], Any] = None, callback: Callable[[Entity], Any] = None):
        super().__init__(EntityTypes.ITEM, preborn_callback, callback)
        self._position = position
        self._strength = strength
        self._item_type = item_type

    @property
    def position(self):
        return self._position

    @property
    def strength(self):
        return self._strength

    @property
    def item_type(self):
        return self._item_type