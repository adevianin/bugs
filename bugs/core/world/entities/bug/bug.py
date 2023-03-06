from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter
from .body import BugBody
from core.world.entities.base.live_entity.action.action_builder import ActionBuilder

class Bug(LiveEntity):

    def __init__(self, event_bus: EventEmitter, action_builder: ActionBuilder, id: int, mind: Mind, body: BugBody):
        super().__init__(event_bus, action_builder, id, EntityTypes.BUG, mind, body)
        self._body.events.add_listener('food_picked', self._on_food_picked)
        self._body.events.add_listener('picked_food_gave', self._on_food_gave)

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
