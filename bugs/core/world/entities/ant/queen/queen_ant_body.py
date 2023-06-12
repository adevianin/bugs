from ..base.ant_body import AntBody
from core.world.entities.nest.nest import Nest

class QueenAntBody(AntBody):

    def build_nest(self, nest: Nest):
        return nest.build()
