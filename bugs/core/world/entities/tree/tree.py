from core.world.entities.base.body import Body
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.entity import Entity

class Tree(Entity):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: Body):
        super().__init__(event_bus, events, id, EntityTypes.TREE, ownership, body)

    def do_step(self, step_number, season):
        pass
