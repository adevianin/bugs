from core.world.utils.point import Point
from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.items.base.item import Item
from core.world.utils.size import Size
from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.world.birthers.requests.nest_birth_request import NestBirthRequest

from typing import List, Callable

class AntBody(LiveBody):

    SIZE = Size(32, 32)

    stats: LiveStats

    def __init__(self, events: EventEmitter, stats: LiveStats, sayer: EventEmitter, memory: Memory, position: Point, angle: int, hp: int, located_in_nest: Nest, picked_item: Item, world_interactor: WorldInteractor):
        super().__init__(events, stats, memory, position, angle, hp, world_interactor)
        self.sayer = sayer
        self._located_inside_nest = located_in_nest
        self._picked_item = picked_item

        self.events.add_listener('died', self._on_died)

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
    def can_fly_nuptial_flight(self):
        return False
    
    def get_in_nest(self, nest: Nest):
        self._located_inside_nest = nest
        self.events.emit('action', 'entity_got_in_nest', { 'nest_id': nest.id })

    def get_out_of_nest(self):
        self._located_inside_nest = None
        self.events.emit('action', 'entity_got_out_of_nest')
    
    def say(self, phrase: str, data: dict):
        if (data):
            self.sayer.emit(phrase, data)
        else:
            self.sayer.emit(phrase)
    
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
        self.events.emit('action', 'ant_picked_up_item', { 'item_id': item.id })
        return True

    def give_food(self, nest: Nest):
        nest.take_edible_item(self._picked_item)
        self._picked_item = None
        self.events.emit('action', 'ant_dropped_picked_item')

    def drop_picked_item(self):
        self._picked_item.drop(Point(self.position.x, self.position.y))
        self._picked_item = None
        self.events.emit('action', 'ant_dropped_picked_item')

    def found_nest(self, position: Point, colony_id: int, callback):
        self.events.emit('birth_request', NestBirthRequest.build(position, colony_id, callback))

    def step_to(self, destination_point: Point) -> bool:
        if self.is_in_nest:
            self.get_out_of_nest()
            return False
        return super().step_to(destination_point)
    
    def fly_nuptial_flight(self):
        pass 

    def _on_died(self):
        self.sayer.remove_all_listeners()
    