from ..base.ant_mind import AntMind
from .queen_ant_body import QueenAntBody

class QueenAntMind(AntMind):

    _body: QueenAntBody

    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()
        if not self._body.is_fertilized and not self._has_thoughts_to_do():
            self.patrol_home_territory()