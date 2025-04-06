from core.world.entities.base.entity import Entity
from typing import List, Callable
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.size import Size
from core.world.utils.point import Point
from core.world.utils.check_is_point_on_map import check_is_point_on_map
from .vision_stream_interface import iVisionStream

class VisualSensor():

    _vision_stream: iVisionStream

    def __init__(self):
        self._nearby_entities = []
        self._vision_stream: iVisionStream = None
        self._sight_distance = None

    def set_map_size(self, map_size: Size):
        self._map_size = map_size

    def set_sight_distance(self, sight_distance: int):
        self._sight_distance = sight_distance

    def set_vision_stream(self, vision_stream: iVisionStream):
        self._vision_stream = vision_stream

    def can_walk_to(self, point: Point):
        return check_is_point_on_map(self._map_size, point)

    def get_nearby_entities(self, my_position: Point, types_list: List[EntityTypes] = None, filter: Callable = None) -> List[Entity]:
        return self._vision_stream.find_entities_near(my_position, self._sight_distance, types_list, filter, True)