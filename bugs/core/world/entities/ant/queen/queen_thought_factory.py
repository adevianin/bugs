from core.world.entities.ant.base.ant_thought_factory import AntThoughtFactory
from core.world.entities.nest.nest import Nest
from .thoughts.build_nest_thought import BuildNestThought

class QueenThoughtFactory(AntThoughtFactory):

    def build_build_new_nest_thought(self, new_nest: Nest, sayback: str):
        return BuildNestThought(body=self._body, new_nest=new_nest, sayback=sayback)
