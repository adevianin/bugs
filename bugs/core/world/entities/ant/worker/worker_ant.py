from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .worker_ant_body import WorkerAntBody
from .worker_ant_mind import WorkerAntMind

class WorkerAnt(Ant):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony: int, mind: WorkerAntMind, body: WorkerAntBody):
        super().__init__(event_bus, events, id, AntTypes.WORKER, from_colony, mind, body)