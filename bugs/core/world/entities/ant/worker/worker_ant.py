from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .worker_ant_body import WorkerAntBody
from .worker_ant_mind import WorkerAntMind

class WorkerAnt(Ant):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, body: AntBody, mind: AntMind):
        super().__init__(event_bus, events, id, from_colony_id, body, AntTypes.WORKER, mind)