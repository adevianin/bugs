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

    def __init__(self, events: EventEmitter, id: int, ant_type: AntTypes, from_colony: int, mind: AntMind, body: AntBody):
        super().__init__(events, id, EntityTypes.ANT, from_colony, mind, body)
        self._ant_type = ant_type
        
        self._body.events.add_listener('food_picked', self._on_food_picked)
        self._body.events.add_listener('picked_food_gave', self._on_food_gave)
        self._body.events.add_listener('picked_food_dropped', self._on_food_dropped)

    @property
    def ant_type(self):
        return self._ant_type
    
    @property
    def home_nest_id(self):
        return self._mind.home_nest.id if self._mind.home_nest else None
    
    @property
    def home_nest(self):
        return self._mind.home_nest
    
    def feed_myself(self, sayback: str = None):
        self._mind.feed_myself(sayback)
    
    def collect_food(self, sayback: str = None):
        self._mind.collect_food(sayback)
    
    def relocate_to_nest(self, nest: Nest):
        self._mind.relocate_to_nest(nest)

    def found_nest(self, building_site: Point, sayback: str):
        self._mind.found_nest(building_site=building_site, from_colony_id=self.from_colony, sayback=sayback)

    def build_nest(self, nest: Nest, sayback: str = None):
        self._mind.build_nest(nest=nest, sayback=sayback)

    def attack_nest(self, nest: Nest, sayback: str = None):
        self._mind.attack_nest(nest=nest, sayback=sayback)

    def set_formation(self, formation: Formation):
        self._body.set_formation(formation)

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'picked_food_id': self._body.picked_food.id if self._body.is_food_picked else None,
            'ant_type': self._ant_type
        })

        return json
    
    def leave_operation(self):
        super().leave_operation()
        self._body.remove_formation()

    def _on_died(self):
        super()._on_died()
        self._body.remove_formation()
    
    def _on_food_picked(self, food_id):
        self._emit_action('ant_picked_up_food', {
            'food_id': food_id
        })

    def _on_food_gave(self):
        self._emit_action('ant_gave_picked_food')

    def _on_food_dropped(self):
        self._emit_action('ant_dropped_picked_food')

    
