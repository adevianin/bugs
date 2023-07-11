from ..base.ant_mind import AntMind

from core.world.utils.point import Point

class WorkerAntMind(AntMind):

    def _generate_thoughts(self):
        super()._generate_thoughts()
        if not self._has_thoughts_to_do():
            thought = self._thought_factory.build_collect_food_full_thought(nest=self.home_nest)
            self._register_thought(thought)

        # if not self._has_thoughts_to_do():
        #     thought = self._thought_factory.build_prepare_for_operation_full_thought(self._body, self.home_nest, self._memory, Point(500, 500))
        #     self._register_thought(thought)
        #     print(1)

    def _generate_feed_myself_thought(self):
        return self._thought_factory.build_feed_myself_full_thought(self.home_nest)