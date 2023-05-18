from ..base.bug import Bug
from ..base.bug_types import BugTypes
from core.world.utils.event_emiter import EventEmitter
from .collector_bug_body import CollectorBugBody
from .collector_bug_mind import CollectorBugMind

class CollectorBug(Bug):

    def __init__(self, event_bus: EventEmitter, id: int, mind: CollectorBugMind, body: CollectorBugBody):
        super().__init__(event_bus, id, BugTypes.FOOD_COLLECTOR, mind, body)