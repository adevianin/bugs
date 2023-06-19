from core.world.entities.ant.base.ant_thought_factory import AntThoughtFactory
from core.world.entities.nest.nest import Nest
from .thoughts.build_nest_thought import BuildNestThought

class QueenThoughtFactory(AntThoughtFactory):

    def build_build_new_nest_thought(self, new_nest: Nest):
        return BuildNestThought(self._body, new_nest)
