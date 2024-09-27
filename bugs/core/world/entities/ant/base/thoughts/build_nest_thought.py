from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_body import AntBody

class BuildNestThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, building_nest: Nest, get_inside_once_done: bool, flags: dict, sayback: str):
        super().__init__(body=body, type=ThoughtTypes.BUILD_NEST, flags=flags, sayback=sayback)
        self._building_nest = building_nest
        self._get_inside_once_done = get_inside_once_done

    @property
    def building_nest_id(self):
        return self._building_nest.id
    
    @property
    def get_inside_once_done(self):
        return self._get_inside_once_done
    
    def do_step(self):
        if (self._building_nest.is_built):
            if self._get_inside_once_done:
                self._body.get_in_nest(self._building_nest)
            self.done()
        else:
            self._body.build_nest(self._building_nest)
