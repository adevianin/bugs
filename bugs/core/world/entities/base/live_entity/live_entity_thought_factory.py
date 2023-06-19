from core.world.entities.thought.thought_factory import ThoughtFactory
from .thoughts.go_in_nest import GoInNestThought
from core.world.entities.nest.nest import Nest
from core.world.utils.point import Point
from .thoughts.walk_to_thought import WalkToThought

class LiveEntityThoughtFactory(ThoughtFactory):

    def build_go_in_nest_thought(self, nest: Nest):
        return GoInNestThought(self._body, nest)
    
    def build_walk_to_thought(self, position: Point):
        return WalkToThought(self._body, position)

