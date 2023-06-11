from ..base.live_entity.body import Body
from core.world.entities.town.town import Town

class TaskFactory:

    def __init__(self, body: Body) -> None:
        self._body = body

    