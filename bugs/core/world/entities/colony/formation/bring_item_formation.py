from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .formation import Formation
from core.world.entities.item.items.base.item import Item
from core.world.utils.size import Size

class BringItemFormation(Formation):

    def __init__(self, event_bus: EventEmitter, unit_size: Size, events: EventEmitter, dest_point: Point, unit_step_size: int, position: Point, should_optimize_position_closer: bool, item: Item):
        super().__init__(event_bus, unit_size, events, dest_point, unit_step_size, position, should_optimize_position_closer)
        self._item = item
        self._item_size = item.body.SIZE

    def _calc_unit_formation_position(self, unit_id):
        item_width = self._item_size.width
        item_height = self._item_size.height
        item_angle = self._item.body.angle
        
        match(unit_id):
            case 'item':
                p = Point(self._position.x, self._position.y)
            case 1:
                p = Point(self._position.x - (item_width/2) , self._position.y + item_height / 2)
            case 2:
                p = Point(self._position.x + (item_width/2) - (self._unit_size.width / 2), self._position.y + item_height / 2)
            case 3:
                p = Point(self._position.x + (item_width/2) - (self._unit_size.height / 2), self._position.y - item_height / 2)
            
        p = p.rotate(item_angle, self._position)

        return p
