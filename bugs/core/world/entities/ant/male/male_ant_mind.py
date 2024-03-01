from ..base.ant_mind import AntMind

class MaleAntMind(AntMind):

    def ask_participation(self):
        return False

    def _generate_thoughts(self):
        super()._generate_thoughts()
