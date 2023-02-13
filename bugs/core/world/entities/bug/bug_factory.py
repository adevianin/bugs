from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .bug import Bug
from .body import BugBody
from .mind import BugMind
from .tasks.task_factory import BugTaskFactory
from core.world.map import Map
from core.world.entities.town import Town
from core.world.entities.base.live_entity.action.action_builder import ActionBuilder

class BugFactory():

    def __init__(self, event_bus: EventEmitter, action_builder: ActionBuilder) -> None:
        self._event_bus = event_bus
        self._action_builder = action_builder

    def build_bug(self, map: Map, id: int, position: Point, town: Town) -> Bug:
        bug_events = EventEmitter()
        body = BugBody(bug_events, position)
        bug_task_factory = BugTaskFactory(body, map)
        mind = BugMind(body, bug_task_factory, map, town)
        bug = Bug(self._event_bus, self._action_builder, id, mind, body)

        return bug
