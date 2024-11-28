from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.base.live_entity.mind import Mind
from core.world.entities.thought.thought_types import ThoughtTypes

class LadybugMind(Mind):

    def __init__(self, body: LiveBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool):
        super().__init__(body, thought_factory, is_auto_thought_generation)

    def hunt_for_aphid(self):
        thought = self._thought_factory.build_hunt_for_aphid_thought_new()
        self._register_thought(thought)

    def hibernate(self):
        thought = self._thought_factory.build_ladybug_hibernation_thought_new()
        self._register_thought(thought, asap=True)

    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()

        if (self._body.check_urge_to_hibernate() and not self._is_thought_in_stack(ThoughtTypes.LADYBUG_HIBERNATION)):
            self.hibernate()

        if not self._has_thoughts_to_do():
            self.hunt_for_aphid()