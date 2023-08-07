from ..base.ant_mind import AntMind
from core.world.entities.nest.nest import Nest
from core.world.utils.point import Point

class QueenAntMind(AntMind):

    def ask_participation(self):
        return False

    def _generate_thoughts(self):
        super()._generate_thoughts()

    def _generate_feed_myself_thought(self):
        self.feed_myself(asap=True)
