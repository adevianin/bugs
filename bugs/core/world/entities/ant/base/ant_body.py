from core.world.utils.point import Point
from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.visual_sensor import VisualSensor
from core.world.entities.base.live_entity.temperature_sensor import TemperatureSensor
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.items.base.item import Item
from core.world.utils.size import Size
from .genetic.genome import Genome
from .ant_stats import AntStats

from typing import List, Callable

class AntBody(LiveBody):

    SIZE = Size(32, 32)

    stats: AntStats

    def __init__(self, events: EventEmitter, stats: AntStats, sayer: EventEmitter, memory: Memory, position: Point, angle: int, hp: int, located_in_nest: Nest, picked_item: Item, 
                 visual_sensor: VisualSensor, temperature_sensor: TemperatureSensor, genome: Genome):
        super().__init__(events, stats, memory, position, angle, hp, visual_sensor, temperature_sensor)
        self.sayer = sayer
        self._located_inside_nest = located_in_nest
        self._picked_item = picked_item
        self._genome = genome

    @property
    def located_in_nest_id(self):
        return self._located_inside_nest.id if self._located_inside_nest else None
    
    @property
    def located_in_nest(self) -> Nest:
        return self._located_inside_nest
    
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
    def genome(self) -> Genome:
        return self._genome
    
    @property
    def is_guardian_behavior(self):
        return bool(self.memory.read('guardian_behavior'))
    
    @property
    def is_cooperative_behavior(self):
        return bool(self.memory.read('cooperative_behavior'))
    
    def toggle_guardian_behavior(self, is_enabled: bool):
        self.memory.save('guardian_behavior', is_enabled)

    def toggle_cooperative_behavior(self, is_enabled: bool):
        self.memory.save('cooperative_behavior', is_enabled)
    
    def get_in_nest(self, nest: Nest):
        self._located_inside_nest = nest

        self.events.emit('got_in_nest', nest.id)

    def get_out_of_nest(self):
        self._located_inside_nest = None
        self.events.emit('got_out_of_nest')
    
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
        self.events.emit('picked_up_item', item.id)
        return True

    def give_food(self, nest: Nest):
        nest.take_edible_item(self._picked_item)
        self._picked_item = None
        self.events.emit('dropped_picked_item')

    def drop_picked_item(self):
        self._picked_item.drop(Point(self.position.x, self.position.y))
        self._picked_item = None
        self.events.emit('dropped_picked_item')

    def step_to(self, destination_point: Point) -> bool:
        if self.is_in_nest:
            self.get_out_of_nest()
            return False
        return super().step_to(destination_point)
    
    def eat_from_nest(self, nest: Nest):
        needed_cals = self.calc_how_much_calories_is_need()
        calories = nest.give_calories(needed_cals)
        self.eat_calories(calories)
    
    def _die(self):
        super()._die()
        self.sayer.remove_all_listeners()