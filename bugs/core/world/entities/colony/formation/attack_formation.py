from core.world.utils.point import Point
from core.world.utils.point import Point
from .formation import Formation

class AttackFormation(Formation):

    def _calc_unit_formation_position(self, unit_id):
        row_index = int(unit_id / 2)
        col_index = unit_id % 2

        x = self._position.x - row_index * AttackFormation.UNIT_WIDTH
        y = self._position.y + col_index * AttackFormation.UNIT_HEIGHT

        p = Point(x, y)
        p = p.rotate(self._x_axis_angle, self._position)

        return p
