from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from .find_food_thought import FindFoodThought
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.food.food import Food
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody

class CollectFoodThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, nest: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.COLLECT_FOOD, flags=flags, sayback=sayback)
        self._nest = nest
        self._nested_thoughts['find_food_thought'] = find_food_thought
        self._nested_thoughts['go_home_thought'] = go_home_thought
        self._found_food = found_food

        self._nest.events.add_listener('died', self._on_nest_died)

    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def find_food_thought(self) -> FindFoodThought:
        return self._nested_thoughts['find_food_thought']
    
    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']
    
    @property
    def found_food_id(self):
        return self._found_food.id if self._found_food else None

    def do_step(self):
        if (not self._read_flag('is_find_food_done')):
            is_doing_action = self.find_food_thought.do_step()
            if(self.find_food_thought.is_done):
                self._found_food = self.find_food_thought.results
                self._write_flag('is_find_food_done', True)
            if (is_doing_action):
                return True

        if (self._read_flag('is_find_food_done') and not self._read_flag('is_get_to_food_done')):
            self._write_flag('is_get_to_food_done', self._body.step_to_near(self._found_food.position))
            return

        if (self._read_flag('is_get_to_food_done') and not self._read_flag('is_pickup_food_done')):
            if (self._found_food.is_picked):
                self.restart()
                return
            self._write_flag('is_pickup_food_done', self._body.pick_up_food(self._found_food))
            return
            
        if (self._read_flag('is_pickup_food_done') and not self._read_flag('is_go_home_done')):
            self.go_home_thought.do_step()
            self._write_flag('is_go_home_done', self.go_home_thought.is_done)
            return
        
        if (self._read_flag('is_go_home_done') and not self._read_flag('is_food_taken_by_home')):
            self._body.give_food(self._nest)
            self._write_flag('is_food_taken_by_home', True)
            self._found_food = None
            return
        
        if (self._read_flag('is_food_taken_by_home') and not self._read_flag('is_got_out_of_nest')):
            self._body.get_out_of_nest()
            self._write_flag('is_got_out_of_nest', True)
            return

        if (self._read_flag('is_got_out_of_nest')):
            self.done()

    def can_be_delayed(self):
        if (self._read_flag('is_pickup_food_done')):
            return False
        else:
            return True
        
    def delay(self):
        self.restart()

    def cancel(self):
        super().cancel()
        if self._body.is_food_picked:
            self._body.drop_picked_food()

    def _on_nest_died(self):
        self.cancel()

    def _on_stop_thinking(self):
        self._nest.events.remove_listener('died', self._on_nest_died)