from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from .find_food_thought import FindFoodThought
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.food.food import Food
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.thought.thought_types import ThoughtTypes

class CollectFoodThought(Thought):

    def __init__(self, nest: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        super().__init__(ThoughtTypes.COLLECT_FOOD, flags, sayback)
        self._nest = nest
        self._find_food_thought = find_food_thought
        self._go_home_thought = go_home_thought
        self._found_food = found_food

    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def find_food_thought(self):
        return self._find_food_thought
    
    @property
    def go_home_thought(self):
        return self._go_home_thought
    
    @property
    def found_food_id(self):
        return self._found_food.id if self._found_food else None

    def do_step(self):
        if (not self._flags['is_find_food_done']):
            self._find_food_thought.do_step()
            if(self._find_food_thought.is_done()):
                self._found_food = self._find_food_thought.results
                self._flags['is_find_food_done'] = True
            if (self._body.is_busy):
                return

        if (self._flags['is_find_food_done'] and not self._flags['is_get_to_food_done']):
            self._flags['is_get_to_food_done'] = self._body.step_to_near(self._found_food.position)
            return

        if (self._flags['is_get_to_food_done'] and not self._flags['is_pickup_food_done']):
            if (self._found_food.is_picked):
                self.restart()
                return
            self._flags['is_pickup_food_done'] = self._body.pick_up_food(self._found_food)
            return
            
        if (self._flags['is_pickup_food_done'] and not self._flags['is_go_home_done']):
            self._go_home_thought.do_step()
            self._flags['is_go_home_done'] = self._go_home_thought.is_done()
            return

        if (self._flags['is_go_home_done'] and not self._flags['is_food_taken_by_home']):
            self._body.give_food(self._nest)
            self._flags['is_food_taken_by_home'] = True
            return
        
        if (self._flags['is_food_taken_by_home'] and not self._flags['is_got_out_of_nest']):
            self._body.get_out_of_nest()
            self._flags['is_got_out_of_nest'] = True
            return

        if (self._flags['is_got_out_of_nest']):
            self.mark_as_done()

    def can_be_delayed(self):
        if (self._flags['is_pickup_food_done']):
            return False
        else:
            return True
        
    def set_mind_parts(self, body: Body, memory: Memory, world_interactor: WorldInteractor):
        super().set_mind_parts(body, memory, world_interactor)
        self._find_food_thought.set_mind_parts(body, memory, world_interactor)
        self._go_home_thought.set_mind_parts(body, memory, world_interactor)
        
    def delay(self):
        self.restart()

    def restart(self):
        super().restart()
        self._reset_flags()
        self._find_food_thought.restart()
        self._go_home_thought.restart()

    def _reset_flags(self):
        self._flags = {
            'is_find_food_done': False,
            'is_get_to_food_done': False,
            'is_pickup_food_done': False,
            'is_go_home_done': False,
            'is_food_taken_by_home': False,
            'is_got_out_of_nest': False
        }
        

