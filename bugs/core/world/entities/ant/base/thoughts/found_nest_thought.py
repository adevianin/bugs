from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_body import AntBody

class FoundNestThought(Thought):

    _body: AntBody

    def __init__(self, building_site: Point, from_colony_id: int, found_nest: Nest, flags: dict, sayback: str):
        super().__init__(type=ThoughtTypes.FOUND_NEST, flags=flags, sayback=sayback)
        self._from_colony_id = from_colony_id
        self._building_site = building_site
        self._found_nest = found_nest

    @property
    def from_colony_id(self):
        return self._from_colony_id
    
    @property
    def building_site(self):
        return self._building_site

    @property
    def found_nest_id(self):
        return self._found_nest.id if self._found_nest else None

    def do_step(self):
        def on_nest_born(nest):
            self._found_nest = nest

        if self._found_nest:
            self.done({
                'nest': self._found_nest
            })
        else:
            self._body.found_nest(self._building_site, self._from_colony_id, on_nest_born)
