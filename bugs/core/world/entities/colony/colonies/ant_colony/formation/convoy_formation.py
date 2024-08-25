from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_types import FormationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .base.base_formation import BaseFormation

class ConvoyFormation(BaseFormation):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, name: str, units: List[Ant], start_point: Point, destination_point: Point):
        super().__init__(event_bus, events, FormationTypes.CONVOY, name, units, start_point, destination_point)

    def _calc_unit_place_position(self, unit_place_number: int) -> Point:
        x = self._current_position.x - unit_place_number * self._unit_size.width
        y = self._current_position.y

        p = Point(x, y)
        p = p.rotate(self._angle, self._current_position)

        return p
    