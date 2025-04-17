from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.item.items.base.item import Item
from core.world.entities.ant.base.ant_activity_types import AntActivityTypes
import random

class CollectFoodThought(Thought):

    class Flags(Thought.Flags):
        AM_I_GOT_FOOD = 'am_i_got_food'
        AM_I_NEAR_TARGET_FOOD_SOURCE_POSITION = 'am_i_near_target_food_source_position'

    _body: AntBody
    IGNORE_EMPTY_FOOD_SOURCE_STEPS = 40

    def __init__(self, nest: Nest, random_walk_thought: RandomWalkThought, go_home_thought: GoInNestThought, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.COLLECT_FOOD, flags=flags, sayback=sayback)
        self._nest = nest
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nested_thoughts['go_home_thought'] = go_home_thought
        self._target_food_source_id = None
        self._target_food_source_position = None

        self._nest_removal_block_id = self._nest.block_removal()
        self._nearby_food_sources_data_manager = self._nest.nearby_food_sources_data_manager

    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._nest.unblock_removal(self._nest_removal_block_id)

    def delay(self):
        self.restart()
        if self._body.is_item_picked:
            self._body.drop_picked_item()

    def can_be_delayed(self):
        return not self._read_flag(self.Flags.AM_I_GOT_FOOD)
    
    def cancel(self):
        super().cancel()
        if self._body.is_item_picked:
            self._body.drop_picked_item()

    def do_step(self):
        self._body.set_current_activity(AntActivityTypes.COLLECTING_FOOD)

        if not self._read_flag(self.Flags.AM_I_GOT_FOOD):

            if not self._check_has_target_food_source():
                self._target_from_nearby_food_sources_data_manager()
                if not self._check_has_target_food_source():
                    food_source = self._random_search_food_source()
                    if food_source:
                        self._nearby_food_sources_data_manager.push_item_source_data(food_source)
                        self._target_from_nearby_food_sources_data_manager()
                    return

            if self._check_has_target_food_source():
                if self._read_flag(self.Flags.AM_I_NEAR_TARGET_FOOD_SOURCE_POSITION):
                    food_sources = self._body.look_around_for_food_sources()
                    if len(food_sources) == 0 or food_sources[0].id != self._target_food_source_id:
                        self._nearby_food_sources_data_manager.remove_data(self._target_food_source_id)
                        self._clear_target_food_source()
                        return

                    def on_got_food(edible_item: Item):
                        self._body.pick_up_item(edible_item)
                        self._write_flag(self.Flags.AM_I_GOT_FOOD, True)

                    is_food_in_source = food_sources[0].take_some_item(on_got_food)

                    if not is_food_in_source:
                        self._body.memory.save_flag(self._build_empty_food_source_memory_flag(self._target_food_source_id), True, self.IGNORE_EMPTY_FOOD_SOURCE_STEPS)
                        self._clear_target_food_source()
                else:
                    is_walk_done = self._body.step_to(self._target_food_source_position)
                    if (is_walk_done):
                        self._write_flag(self.Flags.AM_I_NEAR_TARGET_FOOD_SOURCE_POSITION, True)
        else:
            if self.go_home_thought.is_done:

                #trick to unsynchronize ants with the same speed
                wait = self._check_should_i_wait()
                if wait:
                    return
                
                self._body.give_food(self._nest)
                self._register_me_as_collecter()

                self.done()
            elif self.go_home_thought.is_canceled:
                self.cancel()
            else:
                self.go_home_thought.do_step()

    def _check_should_i_wait(self):
        another_colelcters_count = self._nest.collect_food_ant_speed_register.count(self._body.stats.distance_per_step)
        if another_colelcters_count == 0:
            return False
        elif another_colelcters_count <= 3:
            return random.choice([True, False])
        else:
            return False
        
    def _register_me_as_collecter(self):
        self._nest.collect_food_ant_speed_register.append(self._body.stats.distance_per_step)

    def _build_empty_food_source_memory_flag(self, id: int):
        return f'collect_food_thought:empty_food_source_{id}'
    
    def _check_has_target_food_source(self):
        return bool(self._target_food_source_position)
    
    def _target_from_nearby_food_sources_data_manager(self):
        for id, position in self._nearby_food_sources_data_manager.data.items():
            if not self._body.memory.read_flag(self._build_empty_food_source_memory_flag(id)):
                self._target_food_source_id = id
                self._target_food_source_position = position
                return
            
    def _random_search_food_source(self):
        self.random_walk_thought.do_step()
        food_sources = self._body.look_around_for_food_sources()
        for food_source in food_sources:
            if food_source.position.dist(self._nest.position) <= self._nest.area:
                return food_source
            
        return None
            
    def _get_food_source_data(self):
        for id, position in self._nearby_food_sources_data_manager.data.items():
            if not self._body.memory.read_flag(self._build_empty_food_source_memory_flag(id)):
                return (id, position)
            
        return None
    
    def _clear_target_food_source(self):
        self._target_food_source_position = None
        self._target_food_source_id = None
        self._write_flag(self.Flags.AM_I_NEAR_TARGET_FOOD_SOURCE_POSITION, False)
