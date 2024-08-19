from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_types import FormationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .base.base_formation import BaseFormation

class ConvoyFormation(BaseFormation):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, units: List[Ant], start_point: Point, destination_point: Point, is_activated: bool):
        super().__init__(event_bus, events, FormationTypes.CONVOY, units, start_point, destination_point, is_activated)

    def _calc_unit_place_position(self, unit_place_number: int) -> Point:
        row_index = int(unit_place_number / 2)
        col_index = unit_place_number % 2

        x = self._current_position.x - row_index * self._unit_size.width
        y = self._current_position.y + col_index * self._unit_size.height

        p = Point(x, y)
        p = p.rotate(self._angle, self._current_position)

        return p
    