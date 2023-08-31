from core.world.utils.point import Point
from core.world.entities.base.live_entity.body import Body
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.colony.formation.formation import Formation
from core.world.entities.items.base.item_source import ItemSource
from core.world.entities.items.base.item_types import ItemTypes
from core.world.entities.items.base.item import Item

from typing import List, Callable

class AntBody(Body):

    DISTANCE_PER_SEP = 32
    SIGHT_DISTANCE = 200

    def __init__(self, events: EventEmitter, sayer: EventEmitter, memory: Memory, dna_profile: str, position: Point, hp: int, located_in_nest: Nest, picked_item: Item, world_interactor: WorldInteractor):
        super().__init__(events, memory, dna_profile, position, hp, world_interactor)
        self.sayer = sayer
        self._located_inside_nest = located_in_nest
        self._picked_item = picked_item
        self._formation = None

        self.events.add_listener('position_changed', self._on_position_changed)

    @property
    def located_in_nest_id(self):
        return self._located_inside_nest.id if self._located_inside_nest else None
    
    @property
    def is_in_nest(self):
        return self._located_inside_nest != None

    @property
    def is_item_picked(self):
        return self._picked_item is not None
    
    @property
    def picked_item(self):
        return self._picked_item
    
    @property
    def picked_item_id(self):
        return self._picked_item.id if self.is_item_picked else None
    
    @property
    def has_formation(self):
        return self._formation != None
    
    @property
    def formation(self):
        return self._formation
    
    def get_in_nest(self, nest: Nest):
        self._located_inside_nest = nest
        self.events.emit('got_in_nest', nest)

    def get_out_of_nest(self):
        self._located_inside_nest = None
        self.events.emit('got_out_of_nest')
    
    def say(self, phrase: str, data: dict):
        if (data):
            self.sayer.emit(phrase, data)
        else:
            self.sayer.emit(phrase)
    
    def set_formation(self, formation: Formation):
        self._formation = formation
        unit_number = self._formation.register_unit(self.position)
        self.memory.save('formation_unit_number', unit_number)
        self._formation.events.add_listener('reached_destination', self.remove_formation)

    def remove_formation(self):
        if self.has_formation:
            self._formation.events.remove_listener('reached_destination', self.remove_formation)
            self.formation.remove_unit(self.memory.read('formation_unit_number'))
            self.memory.clear('formation_unit_number')
            self._formation = None

    def step_in_formation(self):
        unit_number = self.memory.read('formation_unit_number')
        position = self._formation.get_position_for_unit(unit_number)
        return self.step_to(position)
    
    def look_around_for_food(self):
        honeydew_filter: Callable[[ItemSource], bool] = lambda item_source: item_source.item_type == ItemTypes.HONEYDEW
        return self.look_around(types_list=[EntityTypes.ITEM], filter=honeydew_filter)
    
    def look_around_for_food_sources(self) -> List[ItemSource]:
        honeydew_filter: Callable[[ItemSource], bool] = lambda item_source: item_source.item_type == ItemTypes.HONEYDEW
        return self.look_around(types_list=[EntityTypes.ITEM_SOURCE], filter=honeydew_filter)
    
    def build_nest(self, nest: Nest):
        nest.build()
        self._consume_calories(10)

    def pick_up_item(self, item: Item):
        self._picked_item = item
        item.pickup()
        self.events.emit('item_picked', item_id=item.id)
        return True

    def give_food(self, nest: Nest):
        nest.take_edible_item(self._picked_item)
        self._picked_item = None
        self.events.emit('picked_item_dropped')

    def drop_picked_item(self):
        self._picked_item.drop(Point(self.position.x, self.position.y))
        self._picked_item = None
        self.events.emit('picked_item_dropped')

    def found_nest(self, position: Point, colony_id: int, callback):
        self.events.emit('birth_request', {
            'entity_type': EntityTypes.NEST,
            'position': position,
            'colony_id': colony_id,
            'callback': callback
        })

    def _on_position_changed(self):
        if self.has_formation:
            self._tell_position_to_formation()

    def _tell_position_to_formation(self):
        self._formation.unit_changed_position(self.position, self.memory.read('formation_unit_number'))

    def step_to(self, destination_point: Point) -> bool:
        if self.is_in_nest:
            self.get_out_of_nest()
            return False
        return super().step_to(destination_point)