from core.world.entities.base.live_entity import Body
from core.world.utils.point import Point

class BugBody(Body):

    def __init__(self, position: Point):
        super().__init__(position, 100, 0.5, 150)