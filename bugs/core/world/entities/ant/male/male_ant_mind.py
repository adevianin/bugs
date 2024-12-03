from ..base.ant_mind import AntMind

class MaleAntMind(AntMind):
    
    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()
        if not self._has_thoughts_to_do():
            self.patrol_home_territory()