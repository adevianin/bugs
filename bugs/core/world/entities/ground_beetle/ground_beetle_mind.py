from bugs.core.world.entities.base.live_entity.body import Body
from bugs.core.world.entities.thought.thought_factory import ThoughtFactory
from bugs.core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.mind import Mind

class GroundBeetleMind(Mind):

    def __init__(self, events: EventEmitter, body: Body, thought_factory: ThoughtFactory, is_auto_thought_generation: bool):
        super().__init__(events, body, thought_factory, is_auto_thought_generation)