from abc import ABC
from core.world.utils.point import Point
from typing import List, Callable
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.entity import Entity

class iVisionStream(ABC):

    def find_entities_near(self, point: Point, max_distance: int, entity_types: List[EntityTypes] = None, filter: Callable[[Entity], bool] = None, is_detectable_only: bool = True) -> List[Entity]:
        pass