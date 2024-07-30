from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.nest.nest import Nest
from core.world.entities.thought.thought_factory import ThoughtFactory
from ..base.ant_mind import AntMind
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.utils.point import Point

class WorkerAntMind(AntMind):

    def __init__(self, body: AntBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool, home_nest: Nest, is_in_operation: bool):
        super().__init__(body, thought_factory, is_auto_thought_generation, home_nest, is_in_operation)

    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()
        if not self._has_thoughts_to_do():
            self.collect_food()
