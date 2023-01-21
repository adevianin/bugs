from core.world.entities.base.live_entity import LiveEntity
from core.world.entities.entity_types import EntityTypes
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter

class Bug(LiveEntity):

    def __init__(self, event_bus: EventEmitter, id: int, mind: Mind, body: Body):
        super().__init__(event_bus, id, EntityTypes.BUG, mind, body)

    def do_step(self):
        self._body.restore_energy()
        self._mind.do_step()
        self.emit_change()