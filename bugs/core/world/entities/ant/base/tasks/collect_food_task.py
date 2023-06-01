from core.world.entities.base.live_entity.tasks.task import Task
from ..ant_body import AntBody
from core.world.entities.town.town import Town
from .find_food_task import FindFoodTask
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.tasks.go_in_town import GoInTownTask

class CollectFoodTask(Task):

    def __init__(self, body: AntBody, town: Town, find_food_task: FindFoodTask, go_home_task: GoInTownTask):
        super().__init__(body)
        self._town = town
        self._find_food_task = find_food_task
        self._go_home_task = go_home_task
        self._found_food = None

        self._reset_flags()

    def do_step(self):
        if (not self._is_find_food_done):
            self._find_food_task.do_step()
            if(self._find_food_task.is_done()):
                self._found_food = self._find_food_task.results
                self._is_find_food_done = True
            if (self._body.is_busy):
                return

        if (self._is_find_food_done and not self._is_get_to_food_done):
            self._is_get_to_food_done = self._body.step_to_near(self._found_food.position)
            return

        if (self._is_get_to_food_done and not self._is_pickup_food_done):
            if (self._found_food.is_hidden):
                self.restart()
                return
            self._is_pickup_food_done = self._body.pick_up_food(self._found_food)
            return
            
        if (self._is_pickup_food_done and not self._is_go_home_done):
            self._go_home_task.do_step()
            self._is_go_home_done = self._go_home_task.is_done()
            return

        if (self._is_go_home_done and not self._is_food_taken_by_home):
            self._body.give_food(self._town)
            self._is_food_taken_by_home = True
            return
        
        if (self._is_food_taken_by_home and not self._is_got_out_of_town):
            self._body.get_out_of_town()
            self._is_got_out_of_town = True
            return

        if (self._is_got_out_of_town):
            self.mark_as_done()

    def can_be_delayed(self):
        if (self._is_pickup_food_done):
            return False
        else:
            return True
        
    def delay(self):
        self.restart()

    def restart(self):
        super().restart()
        self._reset_flags()
        self._find_food_task.restart()
        self._go_home_task.restart()

    def _look_around_for_food(self):
        foods = self._map.find_entities_near(self._body.position, self._body.sight_distance, [EntityTypes.FOOD])

        if (len(foods) > 0):
            return foods[0]
        else:
            return None
        
    def _reset_flags(self):
        self._is_find_food_done = False
        self._is_get_to_food_done = False
        self._is_pickup_food_done = False
        self._is_go_home_done = False
        self._is_food_taken_by_home = False
        self._is_got_out_of_town = False
        

