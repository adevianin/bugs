from core.world.utils.point import Point
from core.world.utils.point import Point
from .formation import Formation

class BringItemFormation(Formation):

    def _calc_unit_formation_position(self, unit_number):
        row_index = int(unit_number / 2)
        col_index = unit_number % 2

        x = self._position.x - row_index * self.UNIT_WIDTH
        y = self._position.y + col_index * self.UNIT_HEIGHT

        p = Point(x, y)
        p = p.rotate(self._x_axis_angle, self._position)

        return p
