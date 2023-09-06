from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from .ant_body import AntBody
from .ant_mind import AntMind
from .ant_types import AntTypes
from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.formation.formation import Formation

class Ant(LiveEntity):

    _mind: AntMind
    mind: AntMind
    _body: AntBody
    body: AntBody

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, body: AntBody, ant_type: AntTypes, mind: AntMind):
        super().__init__(events, id, EntityTypes.ANT, from_colony_id, body, mind)
        self._ant_type = ant_type
        
        self.events.add_listener('item_picked', self._on_item_picked)
        self.events.add_listener('picked_item_dropped', self._on_item_dropped)
        self.events.add_listener('died', self._on_died)

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
    
    def prepare_for_operation(self, sayback: str = None):
        self._mind.prepare_for_operation(sayback)
    
    def feed_myself(self, sayback: str = None):
        self._mind.feed_myself(sayback)
    
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

    def walk_in_formation(self):
        self._mind.walk_in_formation()

    def get_in_nest(self, nest: Nest):
        self._body.get_in_nest(nest)

    def get_out_of_nest(self):
        self._body.get_out_of_nest()

    def pick_up_item(self, item):
        self._body.pick_up_item(item)

    def give_food(self, nest: Nest):
        self._body.give_food(nest)

    def set_formation(self, formation: Formation):
        self._body.set_formation(formation)

    def join_operation(self):
        if self._mind.is_in_opearetion:
            raise Exception('already in operation')
        self._mind.toggle_is_in_operation(True)

    def leave_operation(self):
        self._mind.toggle_is_in_operation(False)
        self._mind.free_mind()
        self._mind.toggle_auto_thought_generation(True)
        self._body.sayer.remove_all_listeners()
        self._body.remove_formation()

    def ask_participation(self):
        return self._mind.ask_participation()

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'picked_item_id': self._body.picked_item_id,
            'ant_type': self._ant_type,
            'located_in_nest_id': self._body.located_in_nest_id
        })

        return json
    
    def _on_died(self):
        self._mind.free_mind()
        self._body.remove_formation()
        self._body.sayer.remove_all_listeners()
    
    def _on_item_picked(self, item_id):
        self._emit_action('ant_picked_up_item', {
            'item_id': item_id
        })

    def _on_item_dropped(self):
        self._emit_action('ant_dropped_picked_item')

    
