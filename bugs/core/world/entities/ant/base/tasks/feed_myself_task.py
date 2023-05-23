from core.world.entities.base.live_entity.tasks.task import Task
from ..ant_body import AntBody
from core.world.entities.town import Town
from .find_food_task import FindFoodTask

class FeedMyselfTask(Task):

    def __init__(self, body: AntBody, home: Town, find_food_task: FindFoodTask):
        super().__init__(body)
        self._home = home
        self._find_food_task = find_food_task

        self._found_food = None

        self._is_home_checked = False
        self._is_at_home = False
        self._is_food_found = False
        self._is_near_food = False

    def can_be_delayed(self):
        return False

    def do_step(self):
        if (not self._is_home_checked and not self._is_at_home):
            self._is_at_home = self._body.step_to(self._home.position)
            return
        
        if (not self._is_home_checked and self._is_at_home):
            needed_calories = self._body.calc_how_much_calories_is_need()
            calories = self._home.give_calories(needed_calories)
            self._body.eat_calories(calories)
            self._is_home_checked = True
            if (not self._body.check_am_i_hungry()):
                self.mark_as_done()
            return

        if (self._is_home_checked):
            if (not self._is_food_found):
                self._find_food_task.do_step()
                if (self._find_food_task.is_done()):
                    self._is_food_found = True
                    self._found_food = self._find_food_task.results
                if (self._body.is_busy):
                    return

            if (self._is_food_found and not self._is_near_food):
                self._is_near_food = self._body.step_to_near(self._found_food.position)
                return
                
            if (self._is_near_food):
                is_eatin_done = self._body.eat_food(self._found_food)
                if (is_eatin_done):
                    self.mark_as_done() 

            