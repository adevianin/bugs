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
from core.world.entities.item.items.base.item_types import ItemTypes, ItemTypesPack
from core.world.entities.item.items.base.item import Item
from core.world.utils.size import Size
from .genetic.genome import Genome
from .ant_stats import AntStats
from core.world.entities.base.entity import Entity
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord


from typing import List, Callable

class AntBody(LiveBody):

    SIZE = Size(32, 32)

    stats: AntStats

    def __init__(self, events: EventEmitter, stats: AntStats, sayer: EventEmitter, memory: Memory, position: Point, angle: int, hp: int, birth_step: int, located_in_nest: Nest, 
                 picked_item: Item, visual_sensor: VisualSensor, temperature_sensor: TemperatureSensor, genome: Genome):
        super().__init__(events, stats, memory, position, angle, hp, birth_step, visual_sensor, temperature_sensor)
        self.sayer = sayer
        self._located_inside_nest = located_in_nest
        self._picked_item = picked_item
        self._genome = genome
        self._remembered_entities_cash = {}

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
    
    def look_around_for_building_items(self) -> List[Item]:
        building_item: Callable[[Item], bool] = lambda item: item.item_type in ItemTypesPack.BUILDING_ITEMS
        return self.look_around(types_list=[EntityTypes.ITEM], filter=building_item, nearest_first=True)
    
    def look_around_for_item_with_id(self, id) -> Item:
        id_filter: Callable[[Entity], bool] = lambda entity: entity.id == id
        items = self.look_around(types_list=[EntityTypes.ITEM], filter=id_filter)
        if items:
            return items[0]
        else:
            return None
    
    def build_nest(self, nest: Nest):
        nest.build()

    def pick_up_item(self, item: Item):
        self._picked_item = item
        item.pickup()
        self.events.emit('picked_up_item', item.id)
        return True
    
    def drop_picked_item(self):
        self._picked_item.drop(Point(self.position.x, self.position.y))
        self._picked_item = None
        self.events.emit('dropped_picked_item')

    def has_picked_item(self):
        return bool(self._picked_item)

    def give_food(self, nest: Nest):
        nest.take_edible_item(self._picked_item)
        self._picked_item = None
        self.events.emit('dropped_picked_item')

    def give_fortificating_item(self, nest: Nest):
        nest.take_fortificating_item(self._picked_item)
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

    def get_food_item_from_nest(self, nest: Nest):
        def on_food_ready(ant_food: Item):
            self.pick_up_item(ant_food)

        return nest.get_some_food(on_food_ready, self.stats.attack)
    
    def remember_entity(self, name: str, entity: Entity):
        key = self._build_entity_key(name)
        if key in self._remembered_entities_cash:
            del self._remembered_entities_cash[key]
        self.memory.save(key, {
            'id': entity.id,
            'position': [entity.position.x, entity.position.y]
        })

    def forget_entity(self, name: str):
        key = self._build_entity_key(name)
        if key in self._remembered_entities_cash:
            del self._remembered_entities_cash[key]
        self.memory.clear(key)

    def recall_entity(self, name: str):
        key = self._build_entity_key(name)
        if key in self._remembered_entities_cash:
            return self._remembered_entities_cash[key]
        data = self.memory.read(key)
        if not data:
            return None
        data['position'] = Point.from_json(data['position'])
        self._remembered_entities_cash[key] = data
        return data
    
    def _build_entity_key(self, name: str):
        return f'entity_{name}'
    
    # def stash_picked_item(self):
    #     if not self._picked_item:
    #         return
    #     item = self._picked_item
    #     self.drop_picked_item()
    #     self.remember_entity('stashed_item', item)

    # def pickup_stashed_item(self):
    #     item_data = self.get_stashed_item_data()
    #     filter: Callable[[Item], List[Item]] = lambda item: item.id == item_data['id']
    #     items = self.visual_sensor.get_nearby_entities(EntityTypes.ITEM, filter)
    #     if len(items) == 1:
    #         self.pick_up_item(items[0])
    #     self.forget_entity('stashed_item')

    # def has_stashed_item(self):
    #     item_memory = self.recall_entity('stashed_item')
    #     return bool(item_memory)
    
    # def get_stashed_item_data(self):
    #     return self.recall_entity('stashed_item')
    
    def die(self, death_record: BaseDeathRecord):
        super().die(death_record)
        self.sayer.remove_all_listeners()