from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.bug import Bug
from .base.tasks.task_factory import BugTaskFactory
from .collector.collector_bug import CollectorBug
from .collector.collector_bug_body import CollectorBugBody
from .collector.collector_bug_mind import CollectorBugMind
from .base.bug_types import BugTypes
from core.world.map import Map
from core.world.entities.town import Town
from core.world.entities.base.live_entity.memory import Memory
from core.world.step_activity.step_activity_accumulator import StepActivityAccumulator

class BugFactory():

    def __init__(self, event_bus: EventEmitter, activity_accumulator: StepActivityAccumulator) -> None:
        self._event_bus = event_bus
        self._activity_accumulator = activity_accumulator

    def build_bug(self, map: Map, id: int, bug_type: BugTypes, position: Point, town: Town) -> Bug:
        match bug_type:
            case BugTypes.FOOD_COLLECTOR:
                return self._build_food_collector_bug(map, id, position, town)
            case _:
                raise Exception('uknown type of bug')

    
    def _build_food_collector_bug(self, map: Map, id: int, position: Point, town: Town):
        bug_events = EventEmitter()
        body = CollectorBugBody(bug_events, position)
        bug_task_factory = BugTaskFactory(body, map)
        mind = CollectorBugMind(body, bug_task_factory, map, Memory(), town)
        bug = CollectorBug(self._event_bus, self._activity_accumulator, id, mind, body)

        return bug

