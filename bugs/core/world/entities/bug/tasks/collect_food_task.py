from core.world.entities.base.live_entity.tasks.task import Task
from ..body import BugBody
from core.world.entities.town import Town
from .find_entity_by_type_task import FindEntityByTypeTask

class CollectFoodTask(Task):

    def __init__(self, body: BugBody, town: Town, search_food_task: FindEntityByTypeTask):
        super().__init__(body)
        self._town = town
        self._search_food_task = search_food_task
        self._found_food = None

        self._is_find_food_done = False
        self._is_get_to_food_done = False
        self._is_pickup_food_done = False
        self._is_go_home_done = False
        self._is_food_taken_by_home = False

    def do_step(self):
        if (not self._is_find_food_done):
            self._search_food_task.do_step()
            if (self._search_food_task.is_done()):
                self._found_food = self._search_food_task.results[0]
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
        

