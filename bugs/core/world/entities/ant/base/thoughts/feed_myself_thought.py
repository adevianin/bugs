from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.items.item import Item
from .find_food_thought import FindFoodThought
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.thought.thought_types import ThoughtTypes

class FeedMyselfThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Item = None, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.FEED_MYSELF, flags=flags, sayback=sayback)
        self._home = home
        self._nested_thoughts['find_food_thought'] = find_food_thought
        self._nested_thoughts['go_home_thought'] = go_home_thought

        self._found_food = found_food

    @property
    def home_id(self):
        return self._home.id
    
    @property
    def found_food_id(self):
        return self._found_food.id if self._found_food else None

    @property
    def find_food_thought(self) -> FindFoodThought:
        return self._nested_thoughts['find_food_thought']
    
    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']

    def can_be_delayed(self):
        return False

    def do_step(self):
        if (not self._read_flag('is_home_checked') and not self._check_is_at_home()):
            self.go_home_thought.do_step()
            return
        
        if (not self._read_flag('is_home_checked') and self._check_is_at_home()):
            needed_calories = self._body.calc_how_much_calories_is_need()
            calories = self._home.give_calories(needed_calories)
            self._body.eat_calories(calories)
            self._write_flag('is_home_checked', True)
            self._body.get_out_of_nest()
            if (not self._body.check_am_i_hungry()):
                self.done()
            return

        if (self._read_flag('is_home_checked')):
            if (not self._read_flag('is_food_found')):
                is_doing_action = self.find_food_thought.do_step()
                if (self.find_food_thought.is_done):
                    self._write_flag('is_food_found', True)
                    self._found_food = self.find_food_thought.results
                if (is_doing_action):
                    return True

            if (self._read_flag('is_food_found') and not self._read_flag('is_near_food')):
                self._write_flag('is_near_food', self._body.step_to_near(self._found_food.position))
                return
                
            if (self._read_flag('is_near_food')):
                is_eatin_done = self._body.eat_edible_item(self._found_food)
                if (is_eatin_done):
                    self.done() 

    def _check_is_at_home(self):
        return self._body.located_in_nest_id == self._home.id
