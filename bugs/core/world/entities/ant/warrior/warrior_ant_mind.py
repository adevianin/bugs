from ..base.ant_mind import AntMind

class WarrirorAntMind(AntMind):

    def _generate_thoughts(self):
        super()._generate_thoughts()
        if not self._has_thoughts_to_do():
            thought = self._thought_factory.build_patrolling_nest_territory_thought(self.home_nest)
            self._register_thought(thought)

    def _generate_feed_myself_thought(self):
        self.feed_myself(asap=True)