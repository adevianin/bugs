from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from .ant_body import AntBody
from .ant_mind import AntMind
from .ant_types import AntTypes

class Ant(LiveEntity):

    def __init__(self, event_bus: EventEmitter, id: int, ant_type: AntTypes, mind: AntMind, body: AntBody):
        super().__init__(event_bus, id, EntityTypes.ANT, mind, body)
        self._ant_type = ant_type
        self._body.events.add_listener('food_picked', self._on_food_picked)
        self._body.events.add_listener('picked_food_gave', self._on_food_gave)

    @property
    def ant_type(self):
        return self._ant_type

    def to_json(self):
        json = super().to_json()
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
