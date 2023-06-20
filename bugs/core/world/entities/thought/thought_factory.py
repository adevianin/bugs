from ..base.live_entity.body import Body
from core.world.entities.map import Map

class ThoughtFactory:

    def __init__(self, body: Body, map: Map) -> None:
        self._body = body
        self._map = map

    