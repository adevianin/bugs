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
        self._item_bringing_speed = self._get_item_bringing_speed(units)
        self._listening_ant = None

        self._listen_ant_walk()

    @property
    def item_id(self):
        return self._item.id
    
    def destroy(self):
        super().destroy()
        self._stop_listen_ant_walk()

    def _listen_ant_walk(self):
        self._listening_ant = self._units[0]
        self._listening_ant.events.add_listener('walk', self._on_ant_walk)

    def _stop_listen_ant_walk(self):
        self._listening_ant.events.remove_listener('walk', self._on_ant_walk)
        self._listening_ant = None
    
    def _on_ant_walk(self):
        if not self._current_position.is_equal(self._item.position):
            self._item.be_bringed_to(self._current_position, self._item_bringing_speed)

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
    
    def _get_item_bringing_speed(self, units: List[Ant]):
        user_speeds = (unit.body.user_speed for unit in units)
        user_speed = min(user_speeds)
        return user_speed