from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from .bug_body import BugBody
from .bug_mind import BugMind
from .bug_types import BugTypes

class Bug(LiveEntity):

    def __init__(self, event_bus: EventEmitter, id: int, bug_type: BugTypes, mind: BugMind, body: BugBody):
        super().__init__(event_bus, id, EntityTypes.BUG, mind, body)
        self._bug_type = bug_type
        self._body.events.add_listener('food_picked', self._on_food_picked)
        self._body.events.add_listener('picked_food_gave', self._on_food_gave)

    @property
    def bug_type(self):
        return self._bug_type

    def to_json(self):
        json = super().to_json()
        json.update({
            'picked_food_id': self._body.picked_food.id if self._body.is_food_picked else None
        })

        return json

    def _on_food_picked(self, food_id):
        self.handle_action('food_picked', {
            'food_id': food_id
        })

    def _on_food_gave(self):
        self.handle_action('picked_food_gave')
