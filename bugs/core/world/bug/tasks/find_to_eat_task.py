from .base_task import BaseTask
from ...entity_types import EntityTypes
from ...point import Point

class FindToEatTask(BaseTask):

    SEARCHING_FOOD_STAGE = 1
    WALKING_TO_FOOD_STAGE = 2
    EATING_FOOD_STAGE = 3

    def __init__(self, task_factory, bug_body, map, nearby_town):
        super().__init__(task_factory, bug_body)
        self._map = map
        self._nearby_town = nearby_town
        self._search_task = None
        self._walk_task = None
        self._eat_task = None
        self._food = None
        self._task_stage = FindToEatTask.SEARCHING_FOOD_STAGE

    def do_step(self):
        match self._task_stage:
            case FindToEatTask.SEARCHING_FOOD_STAGE:
                self._do_search_task()
            case FindToEatTask.WALKING_TO_FOOD_STAGE:
                self._do_walk_task()
            case FindToEatTask.EATING_FOOD_STAGE:
                self._do_eat_task()
            
    def _do_search_task(self):
        if not self._search_task:
            self._search_task = self._task_factory.build_search_task(self._bug_body, self._map, EntityTypes.FOOD, self._nearby_town)

        if self._search_task.is_done():
            foods = self._search_task.get_result()
            self._food = foods[0]

            self._task_stage = FindToEatTask.WALKING_TO_FOOD_STAGE
        else:
            self._search_task.do_step()

    def _do_walk_task(self):
        if not self._walk_task:
            food_position = self._food.get_position()
            bug_position = self._bug_body.get_position()
            dist_to_food = 5
            x = food_position.x - dist_to_food if bug_position.x < food_position.x else food_position.x + dist_to_food
            y = food_position.y - dist_to_food if bug_position.y < food_position.y else food_position.y + dist_to_food
            self._walk_task = self._task_factory.build_walk_task(self._bug_body, self._map, Point(x,y))

        if self._walk_task.is_done():
            self._task_stage = FindToEatTask.EATING_FOOD_STAGE
        else:
            self._walk_task.do_step()

    def _do_eat_task(self):
        if not self._eat_task:
            self._eat_task = self._task_factory.build_eat_task(self._bug_body, self._food)

        if self._eat_task.is_done():
            self.mark_as_done()
        else:
            self._eat_task.do_step()

    

        