from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from .ant_body import AntBody
from .ant_mind import AntMind
from .ant_types import AntTypes
from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest

class Ant(LiveEntity):

    _mind: AntMind
    mind: AntMind
    _body: AntBody
    body: AntBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, body: AntBody, ant_type: AntTypes, mind: AntMind):
        super().__init__(event_bus, events, id, EntityTypes.ANT, from_colony_id, body, mind)
        self._ant_type = ant_type
        
    @property
    def sayer(self) -> EventEmitter:
        return self._body.sayer

    @property
    def ant_type(self):
        return self._ant_type
    
    @property
    def home_nest_id(self):
        return self._mind.home_nest.id if self._mind.home_nest else None
    
    @property
    def home_nest(self):
        return self._mind.home_nest
    
    @property
    def located_in_nest_id(self):
        return self._body.located_in_nest_id
    
    @property
    def can_fly_nuptial_flight(self):
        return self._body.can_fly_nuptial_flight
    
    def prepare_for_operation(self, sayback: str = None):
        self._mind.prepare_for_operation(sayback)
    
    # def feed_myself(self, sayback: str = None):
    #     self._mind.feed_myself(sayback)
    
    def collect_food(self, sayback: str = None):
        self._mind.collect_food(sayback)
    
    def relocate_to_nest(self, nest: Nest):
        self._mind.relocate_to_nest(nest)

    def found_nest(self, building_site: Point, sayback: str):
        self._mind.found_nest(building_site=building_site, from_colony_id=self.from_colony_id, sayback=sayback)

    def build_nest(self, nest: Nest, sayback: str = None):
        self._mind.build_nest(nest=nest, sayback=sayback)

    def attack_nest(self, nest: Nest, sayback: str = None):
        self._mind.attack_nest(nest=nest, sayback=sayback)

    def get_in_nest(self, nest: Nest):
        self._body.get_in_nest(nest)

    def get_out_of_nest(self):
        self._body.get_out_of_nest()

    def pick_up_item(self, item):
        self._body.pick_up_item(item)

    def give_food(self, nest: Nest):
        self._body.give_food(nest)

    def free_mind(self):
        self._mind.free_mind()

    def join_operation(self):
        if self._mind.is_in_opearetion:
            raise Exception('already in operation')
        self._mind.toggle_is_in_operation(True)

    def leave_operation(self):
        self._mind.toggle_is_in_operation(False)
        self._mind.free_mind()
        self._mind.toggle_auto_thought_generation(True)
        self._body.sayer.remove_all_listeners()

    def ask_participation(self):
        return self._mind.ask_participation()
    
    def fly_nuptial_flight(self):
        self._body.fly_nuptial_flight()
        