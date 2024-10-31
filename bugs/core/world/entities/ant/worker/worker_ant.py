from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .worker_ant_body import WorkerAntBody
from .worker_ant_mind import WorkerAntMind
from core.world.entities.base.ownership_config import OwnershipConfig

class WorkerAnt(Ant):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, name: str, ownership: OwnershipConfig, is_removal_blocked: bool, body: AntBody, mind: AntMind):
        super().__init__(event_bus, events, id, name, ownership, is_removal_blocked, body, AntTypes.WORKER, mind)