from ..base.bug import Bug
from ..base.bug_types import BugTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.action.action_builder import ActionBuilder
from .collector_bug_body import CollectorBugBody
from .collector_bug_mind import CollectorBugMind

class CollectorBug(Bug):

    def __init__(self, event_bus: EventEmitter, action_builder: ActionBuilder, id: int, mind: CollectorBugMind, body: CollectorBugBody):
        super().__init__(event_bus, action_builder, id, BugTypes.FOOD_COLLECTOR, mind, body)