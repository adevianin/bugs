from .body import Body
from core.world.entities.town.town import Town
from .tasks.go_in_town import GoInTownTask

class TaskFactory:

    def __init__(self, body: Body) -> None:
        self._body = body

    def build_go_in_town_task(self, town: Town):
        return GoInTownTask(self._body, town)
