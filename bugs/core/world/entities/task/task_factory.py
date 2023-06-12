from ..base.live_entity.body import Body
from core.world.entities.nest.nest import Nest

class TaskFactory:

    def __init__(self, body: Body) -> None:
        self._body = body

    