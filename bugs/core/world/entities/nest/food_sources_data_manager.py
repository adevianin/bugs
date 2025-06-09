from core.world.utils.point import Point
from core.world.entities.item.item_sources.base.item_source import ItemSource
from typing import Dict
from collections import OrderedDict

class FoodSourcesDataManager():

    def __init__(self, data: Dict[int, Point]):
        self._data: OrderedDict[int, Point] = OrderedDict(data)

    @property
    def data(self):
        return self._data
    
    def push_item_source_data(self, food_source: ItemSource):
        if food_source.id not in self._data.keys():
            self._data[food_source.id] = food_source.position

    def remove_data(self, id: int):
        if id in self._data:
            del self._data[id]

    def mark_food_source_as_empty(self, food_source_id: int):
        if food_source_id in self._data:
            self._data.move_to_end(food_source_id)
