from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from .ant_body import AntBody
from .ant_mind import AntMind
from .ant_types import AntTypes
from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest

class Ant(LiveEntity):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ant_type: AntTypes, from_colony: int, mind: AntMind, body: AntBody, is_in_operation: bool):
        super().__init__(event_bus, events, id, EntityTypes.ANT, from_colony, mind, body, is_in_operation)
        self._ant_type = ant_type
        
        self._body.events.add_listener('food_picked', self._on_food_picked)
        self._body.events.add_listener('picked_food_gave', self._on_food_gave)

    @property
    def ant_type(self):
        return self._ant_type
    
    def feed_myself(self, sayback: str = None):
        self._mind.feed_myself(sayback)
    
    def collect_food(self, sayback: str = None):
        self._mind.collect_food(sayback)
    
    def relocate_to_nest(self, nest: Nest):
        self._mind.relocate_to_nest(nest)

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'picked_food_id': self._body.picked_food.id if self._body.is_food_picked else None,
            'ant_type': self._ant_type
        })

        return json
    
    def _on_food_picked(self, food_id):
        self.handle_action('ant_picked_up_food', {
            'food_id': food_id
        })

    def _on_food_gave(self):
        self.handle_action('ant_gave_picked_food')
