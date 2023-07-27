from ..base.ant_mind import AntMind

class WarrirorAntMind(AntMind):

    def defend_home_territory(self, sayback: str = None):
        thought = self._thought_factory.build_defend_nest_territory_full(self.home_nest)
        self._register_thought(thought)

    def _generate_thoughts(self):
        super()._generate_thoughts()
        if not self._has_thoughts_to_do():
            self.defend_home_territory()

    def _generate_feed_myself_thought(self):
        self.feed_myself(asap=True)