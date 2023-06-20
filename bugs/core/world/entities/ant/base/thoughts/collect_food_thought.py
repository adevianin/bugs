from core.world.entities.thought.thought import Thought
from ..ant_body import AntBody
from core.world.entities.nest.nest import Nest
from .find_food_thought import FindFoodThought
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.food.food import Food

class CollectFoodThought(Thought):

    def __init__(self, body: AntBody, map, nest: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        super().__init__(body, map, 'collect_food', flags, sayback)
        self._nest = nest
        self._find_food_thought = find_food_thought
        self._go_home_thought = go_home_thought
        self._found_food = found_food

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
            if (self._found_food.is_hidden):
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
        
    def delay(self):
        self.restart()

    def restart(self):
        super().restart()
        self._reset_flags()
        self._find_food_thought.restart()
        self._go_home_thought.restart()

    def to_full_json(self):
        json = super().to_full_json()
        json.update({
            'find_food_thought': self._find_food_thought.to_full_json(),
            'go_home_thought': self._go_home_thought.to_full_json(),
            'found_food_id': self._found_food.id if self._found_food else None,
            'nest_id': self._nest.id
        })

        return json

    def _look_around_for_food(self):
        foods = self._map.find_entities_near(self._body.position, self._body.sight_distance, [EntityTypes.FOOD])

        if (len(foods) > 0):
            return foods[0]
        else:
            return None
        
    def _reset_flags(self):
        self._flags = {
            'is_find_food_done': False,
            'is_get_to_food_done': False,
            'is_pickup_food_done': False,
            'is_go_home_done': False,
            'is_food_taken_by_home': False,
            'is_got_out_of_nest': False
        }
        

