from core.world.entities.base.live_entity.tasks.task import Task
from ..body import BugBody
from core.world.entities.town import Town
from .find_food_task import FindFoodTask
from core.world.entities.base.entity_types import EntityTypes

class CollectFoodTask(Task):

    def __init__(self, body: BugBody, town: Town, find_food_task: FindFoodTask):
        super().__init__(body)
        self._town = town
        self._find_food_task = find_food_task
        self._found_food = None

        self._is_find_food_done = False
        self._is_get_to_food_done = False
        self._is_pickup_food_done = False
        self._is_go_home_done = False
        self._is_food_taken_by_home = False

    def do_step(self):
        if (not self._is_find_food_done):
            self._find_food_task.do_step()
            if(self._find_food_task.is_done()):
                self._found_food = self._find_food_task.results
                self._is_find_food_done = True

        if (self._is_find_food_done and not self._is_get_to_food_done):
            self._is_get_to_food_done = self._body.step_to_near(self._found_food.position)

        if (self._is_get_to_food_done and not self._is_pickup_food_done):
            self._is_pickup_food_done = self._body.pick_up_food(self._found_food)
            
        if (self._is_pickup_food_done and not self._is_go_home_done):
            self._is_go_home_done = self._body.step_to(self._town.position)

        if (self._is_go_home_done and not self._is_food_taken_by_home):
            food = self._body.give_food()
            self._town.take_food(food)
            self._is_food_taken_by_home = True

        if (self._is_food_taken_by_home):
            self.mark_as_done()

    def _look_around_for_food(self):
        foods = self._map.find_entities_near(self._body.position, self._body.sight_distance, [EntityTypes.FOOD])

        if (len(foods) > 0):
            return foods[0]
        else:
            return None
        

