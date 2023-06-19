from ..base.ant_mind import AntMind

class WorkerAntMind(AntMind):

    def _generate_thoughts(self):
        pass
        # super()._generate_thoughts()
        # if not self._has_thoughts_to_do():
        #     thought = self._thought_factory.build_collect_food_thought(self._home_nest, self._memory)
        #     self._register_thought(thought)

    def _generate_feed_myself_thought(self):
        return self._thought_factory.build_feed_myself_thought(self._home_nest, self._memory)