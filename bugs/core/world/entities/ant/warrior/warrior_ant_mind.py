from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.nest.nest import Nest
from core.world.entities.thought.thought_factory import ThoughtFactory
from ..base.ant_mind import AntMind
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.utils.point import Point

class WarrirorAntMind(AntMind):

    def patrol_home_territory(self, sayback: str = None):
        thought = self._thought_factory.build_patrol_nest_territory_new(self.home_nest, sayback=sayback)
        self._register_thought(thought)

    def keep_clear_territory(self, position: Point, area: int, sayback: str = None):
        thought = self._thought_factory.build_keep_clear_territory_new(position=position, area=area, sayback=sayback)
        self._register_thought(thought)

    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()
        if not self._has_thoughts_to_do():
            self.patrol_home_territory()
