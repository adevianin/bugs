from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.body import Body

class NestBody(Body):

    MAX_HP = 1000

    def __init__(self, events: EventEmitter, position: Point, angle: int, hp: int):
        super().__init__(events, position, angle, hp)
