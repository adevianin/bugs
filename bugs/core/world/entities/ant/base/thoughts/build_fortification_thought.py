from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.nest.nest import Nest

class BuildFortificationThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, random_walk_thought: RandomWalkThought, nest: Nest, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.BUILD_FORTIFICATION, flags=flags, sayback=sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nest = nest

    @property
    def nest_id(self):
        return self._nest.id

    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    def cancel(self):
        super().cancel()
        if self._body.is_item_picked:
            self._body.drop_picked_item()

    def do_step(self):
        if not self._read_flag('found_item'):
            items = self._body.look_around_for_building_items()
            if len(items) > 0:
                self._body.remember_entity('building_item', items[0])
                self._write_flag('found_item', True)
                return
            
            self.random_walk_thought.do_step()
            return

        if self._read_flag('found_item') and not self._read_flag('near_item'):
            item_data = self._body.recall_entity('building_item')
            item = self._body.look_around_for_item_with_id(item_data['id'])
            if not item:
                self._forget_found_item()
                return
            is_walk_done = self._body.step_to(item_data['position'])
            if is_walk_done:
                self._write_flag('near_item', True)
            return
            
        if self._read_flag('near_item') and not self._read_flag('picked_item'):
            item_data = self._body.recall_entity('building_item')
            item = self._body.look_around_for_item_with_id(item_data['id'])
            if item:
                self._body.pick_up_item(item)
                self._write_flag('picked_item', True)
            else:
                self._forget_found_item()

            return
        
        if self._read_flag('picked_item') and not self._read_flag('near_nest'):
            is_walk_done = self._body.step_to(self._nest.position)
            if is_walk_done:
                self._write_flag('near_nest', True)
            return

        if self._read_flag('near_nest'):
            self._body.give_fortificating_item(self._nest)
            self.done()

    def _forget_found_item(self):
        self._body.forget_entity('building_item')
        self._write_flag('found_item', False)
        self._write_flag('near_item', False)
    