from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_body import AntBody

class BuildNestThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, building_nest: Nest, flags: dict, sayback: str):
        super().__init__(body=body, type=ThoughtTypes.BUILD_NEST, flags=flags, sayback=sayback)
        self._building_nest = building_nest

    @property
    def building_nest_id(self):
        return self._building_nest.id

    def do_step(self):
        if (self._building_nest.is_built):
            self.done(self._building_nest)
        else:
            self._body.build_nest(self._building_nest)
