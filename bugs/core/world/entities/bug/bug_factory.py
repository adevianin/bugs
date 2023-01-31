from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .bug import Bug
from .body import BugBody
from .mind import BugMind
from .tasks.task_factory import BugTaskFactory
from core.world.map import Map
from core.world.entities.town import Town

class BugFactory():

    def __init__(self, event_bus: EventEmitter) -> None:
        self._event_bus = event_bus

    def build_bug(self, map: Map, id: int, position: Point, town: Town) -> Bug:
        body = BugBody(position)
        bug_task_factory = BugTaskFactory(body, map)
        mind = BugMind(body, bug_task_factory, map, town)
        bug = Bug(self._event_bus, id, mind, body)

        return bug
