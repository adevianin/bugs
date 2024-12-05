from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.nest.nest import Nest

class BuildFortificationThought(Thought):

    class Flags(Thought.Flags):
        FOUND_ITEM = 'found_item'
        NEAR_ITEM = 'near_item'
        PICKED_ITEM = 'picked_item'
        NEAR_NEST = 'near_nest'

    _body: AntBody

    def __init__(self, random_walk_thought: RandomWalkThought, nest: Nest, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.BUILD_FORTIFICATION, flags=flags, sayback=sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nest = nest

        self._nest_block_removal_id = self._nest.block_removal()

    @property
    def nest_id(self):
        return self._nest.id

    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._nest.unblock_removal(self._nest_block_removal_id)
    
    def cancel(self):
        super().cancel()
        if self._body.is_item_picked:
            self._body.drop_picked_item()

    def do_step(self):
        if not self._read_flag(self.Flags.FOUND_ITEM):
            items = self._body.look_around_for_building_items()
            if len(items) > 0:
                self._body.remember_entity('building_item', items[0])
                self._write_flag(self.Flags.FOUND_ITEM, True)
                return
            
            self.random_walk_thought.do_step()
            return

        if self._read_flag(self.Flags.FOUND_ITEM) and not self._read_flag(self.Flags.NEAR_ITEM):
            item_data = self._body.recall_entity('building_item')
            item = self._body.look_around_for_item_with_id(item_data['id'])
            if not item:
                self._forget_found_item()
                return
            is_walk_done = self._body.step_to(item_data['position'])
            if is_walk_done:
                self._write_flag(self.Flags.NEAR_ITEM, True)
            return
            
        if self._read_flag(self.Flags.NEAR_ITEM) and not self._read_flag(self.Flags.PICKED_ITEM):
            item_data = self._body.recall_entity('building_item')
            item = self._body.look_around_for_item_with_id(item_data['id'])
            if item:
                self._body.pick_up_item(item)
                self._write_flag(self.Flags.PICKED_ITEM, True)
            else:
                self._forget_found_item()

            return
        
        if self._read_flag(self.Flags.PICKED_ITEM) and not self._read_flag(self.Flags.NEAR_NEST):
            is_walk_done = self._body.step_to(self._nest.position)
            if is_walk_done:
                self._write_flag(self.Flags.NEAR_NEST, True)
            return

        if self._read_flag(self.Flags.NEAR_NEST):
            if not self._nest.is_died:
                self._body.give_fortificating_item(self._nest)
                if self._body.check_am_i_hungry():
                    self._body.get_in_nest(self._nest)
                    self._body.eat_from_nest(self._nest)
            else:
                self._body.drop_picked_item()
            self.done()

    def _forget_found_item(self):
        self._body.forget_entity('building_item')
        self._write_flag(self.Flags.FOUND_ITEM, False)
        self._write_flag(self.Flags.NEAR_ITEM, False)
    