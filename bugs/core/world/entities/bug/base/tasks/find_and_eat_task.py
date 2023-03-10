from core.world.entities.base.live_entity.tasks.task import Task
from ..bug_body import BugBody
from .find_entity_by_type_task import FindEntityByTypeTask
from core.world.entities.food.food import Food
from core.world.utils.point import Point

class FindAndEatTask(Task):

    def __init__(self, body: BugBody, find_entity_by_type_task: FindEntityByTypeTask):
        super().__init__(body)
        self._find_entity_by_type_task = find_entity_by_type_task

        self._found_food = None
        self._near_food_point = None
        self._is_bug_near_food = False
        self._is_bug_eat_done = False

    def do_step(self):
        if (not self._found_food): 
            self._find_entity_by_type_task.do_step()
            if (self._find_entity_by_type_task.is_done()):
                self._found_food = self._find_entity_by_type_task.results[0]
                self._near_food_point = self._calc_near_food_point(self._found_food)

        if (self._found_food and not self._is_bug_near_food):
            self._is_bug_near_food = self._body.step_to(self._near_food_point)

        if (self._is_bug_near_food):
            self._is_bug_eat_done = self._body.eat(self._found_food)
            if (self._is_bug_eat_done):
                self.mark_as_done()
    
    def _calc_near_food_point(self, food: Food):
        padding = 10
        x = food.position.x + padding if self._body.position.x > food.position.x else food.position.x - padding
        y = food.position.y + padding if self._body.position.y > food.position.y else food.position.y - padding

        return Point(x, y)


    