from core.world.entities.thought.thought import Thought
from ..ant_body import AntBody
from core.world.entities.nest.nest import Nest
from .find_food_thought import FindFoodThought
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought

class FeedMyselfThought(Thought):

    def __init__(self, body: AntBody, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought):
        super().__init__(body)
        self._home = home
        self._find_food_thought = find_food_thought
        self._go_home_thought = go_home_thought

        self._found_food = None

        self._is_home_checked = False
        self._is_at_home = self._body.located_in_nest_id == home.id
        self._is_food_found = False
        self._is_near_food = False

    def can_be_delayed(self):
        return False

    def do_step(self):
        if (not self._is_home_checked and not self._is_at_home):
            self._go_home_thought.do_step()
            self._is_at_home = self._go_home_thought.is_done()
            return
        
        if (not self._is_home_checked and self._is_at_home):
            needed_calories = self._body.calc_how_much_calories_is_need()
            calories = self._home.give_calories(needed_calories)
            self._body.eat_calories(calories)
            self._is_home_checked = True
            self._body.get_out_of_nest()
            if (not self._body.check_am_i_hungry()):
                self.mark_as_done()
            return

        if (self._is_home_checked):
            if (not self._is_food_found):
                self._find_food_thought.do_step()
                if (self._find_food_thought.is_done()):
                    self._is_food_found = True
                    self._found_food = self._find_food_thought.results
                if (self._body.is_busy):
                    return

            if (self._is_food_found and not self._is_near_food):
                self._is_near_food = self._body.step_to_near(self._found_food.position)
                return
                
            if (self._is_near_food):
                is_eatin_done = self._body.eat_food(self._found_food)
                if (is_eatin_done):
                    self.mark_as_done() 

            