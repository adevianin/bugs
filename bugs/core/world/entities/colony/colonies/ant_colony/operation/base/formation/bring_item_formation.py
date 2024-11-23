from typing import List
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.ant import Ant
from core.world.utils.point import Point
from .base.base_formation import BaseFormation
from core.world.entities.item.items.base.item import Item
from .base.formation_types import FormationTypes

class BringItemFormation(BaseFormation):

    def __init__(self, events: EventEmitter, name: str, units: List[Ant], current_position: Point, destination_point: Point, item: Item):
        super().__init__(events, FormationTypes.BRING_ITEM, name, units, current_position, destination_point)
        self._item = item
        self._item_size = item.body.SIZE

        self._set_item_bringing()

    @property
    def item_id(self):
        return self._item.id
    
    def _order_units_move_on_positions(self):
        super()._order_units_move_on_positions()
        self._set_item_bringing()
    
    def destroy(self):
        super().destroy()
        self._item.clear_bringing()

    def _calc_unit_place_position(self, unit_place_number: int) -> Point:
        item_width = self._item_size.width
        item_height = self._item_size.height
        item_angle = self._item.body.angle
        
        match(unit_place_number):
            case 0:
                p = Point(self._current_position.x - (item_width/2) , self._current_position.y + item_height / 2)
            case 1:
                p = Point(self._current_position.x + (item_width/2) - (self._unit_size.width / 2), self._current_position.y + item_height / 2)
            case 2:
                p = Point(self._current_position.x + (item_width/2) - (self._unit_size.height / 2), self._current_position.y - item_height / 2)
            
        p = p.rotate(item_angle, self._current_position)

        return p
    
    def _set_item_bringing(self):
        self._item.setup_bringing(self._current_position, self._units[0].formation_distance_per_step)
