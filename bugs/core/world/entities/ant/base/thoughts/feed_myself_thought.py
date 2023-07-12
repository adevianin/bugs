from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.food.food import Food
from .find_food_thought import FindFoodThought
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.thought.thought_types import ThoughtTypes

class FeedMyselfThought(Thought):

    def __init__(self, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        super().__init__(ThoughtTypes.FEED_MYSELF, flags, sayback)
        self._home = home
        self._find_food_thought = find_food_thought
        self._go_home_thought = go_home_thought

        self._found_food = found_food

    @property
    def home_id(self):
        return self._home.id
    
    @property
    def found_food_id(self):
        return self._found_food.id if self._found_food else None

    @property
    def find_food_thought(self):
        return self._find_food_thought
    
    @property
    def go_home_thought(self):
        return self._go_home_thought

    def can_be_delayed(self):
        return False

    def do_step(self):
        if (not self._flags['is_home_checked'] and not self._check_is_at_home()):
            self._go_home_thought.do_step()
            return
        
        if (not self._flags['is_home_checked'] and self._check_is_at_home()):
            needed_calories = self._body.calc_how_much_calories_is_need()
            calories = self._home.give_calories(needed_calories)
            self._body.eat_calories(calories)
            self._flags['is_home_checked'] = True
            self._body.get_out_of_nest()
            if (not self._body.check_am_i_hungry()):
                self.mark_as_done()
            return

        if (self._flags['is_home_checked']):
            if (not self._flags['is_food_found']):
                self._find_food_thought.do_step()
                if (self._find_food_thought.is_done()):
                    self._flags['is_food_found'] = True
                    self._found_food = self._find_food_thought.results
                if (self._body.is_busy):
                    return

            if (self._flags['is_food_found'] and not self._flags['is_near_food']):
                self._flags['is_near_food'] = self._body.step_to_near(self._found_food.position)
                return
                
            if (self._flags['is_near_food']):
                is_eatin_done = self._body.eat_food(self._found_food)
                if (is_eatin_done):
                    self.mark_as_done() 

    def set_mind_parts(self, body: Body, memory: Memory, world_interactor: WorldInteractor):
        super().set_mind_parts(body, memory, world_interactor)
        self._find_food_thought.set_mind_parts(body, memory, world_interactor)
        self._go_home_thought.set_mind_parts(body, memory, world_interactor)
    
    def _check_is_at_home(self):
        return self._body.located_in_nest_id == self._home.id

    def _reset_flags(self):
        self._flags = {
            'is_home_checked': False,
            'is_at_home': False,
            'is_food_found': False,
            'is_near_food': False
        }

            