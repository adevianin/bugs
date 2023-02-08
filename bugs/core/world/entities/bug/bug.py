from core.world.entities.base.live_entity import LiveEntity
from core.world.entities.entity_types import EntityTypes
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter
from .body import BugBody

class Bug(LiveEntity):

    def __init__(self, event_bus: EventEmitter, id: int, mind: Mind, body: BugBody):
        super().__init__(event_bus, id, EntityTypes.BUG, mind, body)
        self._body.events.add_listener('food_picked', self.emit_change)
        self._body.events.add_listener('position_changed', self.emit_change)

    def do_step(self):
        self._body.restore_energy()
        self._mind.do_step()
        # self.emit_change()

    def to_json(self):
        json = super().to_json()
        json.update({
            'is_food_picked': self._body.is_food_picked
        })

        return json