from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.ownership_config import OwnershipConfig

class Ladybug(LiveEntity):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: LiveBody, mind: Mind):
        super().__init__(event_bus, events, id, EntityTypes.LADYBUG, ownership, body, mind)
