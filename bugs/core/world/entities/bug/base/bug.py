from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from .bug_body import BugBody
from .bug_mind import BugMind
from core.world.entities.base.live_entity.action.action_builder import ActionBuilder
from .bug_types import BugTypes

class Bug(LiveEntity):

    def __init__(self, event_bus: EventEmitter, action_builder: ActionBuilder, id: int, bug_type: BugTypes, mind: BugMind, body: BugBody):
        super().__init__(event_bus, action_builder, id, EntityTypes.BUG, mind, body)
        self._bug_type = bug_type
        self._body.events.add_listener('food_picked', self._on_food_picked)
        self._body.events.add_listener('picked_food_gave', self._on_food_gave)

    @property
    def bug_type(self):
        return self._bug_type

    def to_json(self):
        json = super().to_json()
        json.update({
            'is_food_picked': self._body.is_food_picked
        })

        return json

    def _on_food_picked(self, consumed_time_points, food_id):
        self.emit_action('food_picked', consumed_time_points, {
            'food_id': food_id
        })

    def _on_food_gave(self, consumed_time_points):
        self.emit_action('picked_food_gave', consumed_time_points)
