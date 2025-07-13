from ..base.ant_mind import AntMind
from .queen_ant_body import QueenAntBody
from core.world.entities.ant.base.ant_activity_types import AntActivityTypes

class QueenAntMind(AntMind):

    _body: QueenAntBody

    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()
        
        if not self._has_thoughts_to_do():
            if not self.home_nest.is_built:
                self.walk_to(self.home_nest.position)
                if not self._body.is_wings_removed:
                    self.wait_step(1, None)
                    self.remove_wings()
                self._body.set_current_activity(AntActivityTypes.FOUNDING_MAIN_NEST)
                self.build_nest(self.home_nest, True)
                return
            
            if self._body.is_queen_of_colony:
                self._body.set_current_activity(AntActivityTypes.WATCHING_NEST)
            else:
                self.patrol_home_territory()

    def remove_wings(self):
        thought = self._thought_factory.build_remove_wings_thought()
        self._register_thought(thought)

            
