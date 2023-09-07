from core.world.utils.point import Point
from .formation import Formation

class BringItemFormation(Formation):

    def _calc_unit_formation_position(self, unit_number):
        item_width = 50
        item_height = 40
        
        match(unit_number):
            case 0: #item
                p = Point(self._position.x, self._position.y)
            case 1:
                p = Point(self._position.x - (item_width/2) , self._position.y + item_height / 2)
            case 2:
                p = Point(self._position.x + (item_width/2) - (self.UNIT_WIDTH / 2), self._position.y + item_height / 2)
            case 3:
                p = Point(self._position.x + (item_width/2) - (self.UNIT_WIDTH / 2), self._position.y - item_height / 2)
            
        p = p.rotate(45, self._position)

        return p
