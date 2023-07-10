from ..base.ant_mind import AntMind
from core.world.entities.nest.nest import Nest

class QueenAntMind(AntMind):

    def build_new_nest(self, new_nest: Nest, sayback: str):
        thought = self._thought_factory.build_build_new_nest_thought(new_nest=new_nest, sayback=sayback)
        self._register_thought(thought)

    def _generate_thoughts(self):
        super()._generate_thoughts()
        # if not self._has_thoughts_to_do():
        #     thought = self._thought_factory.build_collect_food_thought(self.home_nest, self._memory)
        #     self._register_thought(thought)

    def _generate_feed_myself_thought(self):
        return self._thought_factory.build_feed_myself_thought(self.home_nest)
