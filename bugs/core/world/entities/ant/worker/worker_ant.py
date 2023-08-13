from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .worker_ant_body import WorkerAntBody
from .worker_ant_mind import WorkerAntMind

class WorkerAnt(Ant):

    MAX_HP = 100

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, mind: WorkerAntMind, body: WorkerAntBody):
        super().__init__(events, id, AntTypes.WORKER, from_colony_id, mind, body)