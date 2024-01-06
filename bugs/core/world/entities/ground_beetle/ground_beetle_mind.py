from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.base.live_entity.mind import Mind

class GroundBeetleMind(Mind):

    def __init__(self, body: LiveBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool):
        super().__init__(body, thought_factory, is_auto_thought_generation)

    def hunt_for_aphid(self):
        thought = self._thought_factory.build_hunt_for_aphid_thought_full(self._body)
        self._register_thought(thought)

    def _generate_thoughts(self):
        if not self._has_thoughts_to_do():
            self.hunt_for_aphid()