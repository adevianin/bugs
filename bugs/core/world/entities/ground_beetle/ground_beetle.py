from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.live_entity import LiveEntity

class GroundBeetle(LiveEntity):

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, mind: Mind, body: Body):
        super().__init__(events, id, EntityTypes.GROUND_BEETLE, from_colony_id, mind, body)