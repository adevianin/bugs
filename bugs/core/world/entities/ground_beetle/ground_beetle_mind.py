from core.world.entities.base.live_entity.body import Body
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.mind import Mind

from core.world.utils.point import Point

class GroundBeetleMind(Mind):

    def __init__(self, events: EventEmitter, body: Body, thought_factory: ThoughtFactory, is_auto_thought_generation: bool):
        super().__init__(events, body, thought_factory, is_auto_thought_generation)

    def _generate_thoughts(self):
        self.walk_to(Point(500, 500))