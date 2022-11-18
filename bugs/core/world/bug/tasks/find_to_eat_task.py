from .base_task import BaseTask
from ...entity_types import EntityTypes
from ...point import Point

class FindToEatTask(BaseTask):

    def __init__(self, task_factory, bug_body, map):
        super().__init__(task_factory, bug_body)
        self._map = map
        self._search_task = None
        self._walk_task = None
        self._eat_task = None
        self._food = None
        self._walked_to_food = False

    def do_step(self):
        if not self._food:
            self._do_search_task()
        
        if self._food and not self._walked_to_food:
            self._do_walk_task()
        
        if self._walked_to_food:
            self._do_eat_task()   
            
    def _do_search_task(self):
        if not self._search_task:
            print('creating search task')
            self._search_task = self._task_factory.build_search_task(self._bug_body, self._map, EntityTypes.FOOD)

        if self._search_task.is_done():
            foods = self._search_task.get_result()
            self._food = foods[0]
            print('search task is done', self._food, foods)
        else:
            print('doing search task')
            self._search_task.do_step()

    def _do_walk_task(self):
        if not self._walk_task:
            print('creating walk task', self._bug_body.get_position(), self._food.get_position())
            food_position = self._food.get_position()
            bug_position = self._bug_body.get_position()
            dist_to_food = 5
            x = food_position.x - dist_to_food if bug_position.x < food_position.x else food_position.x + dist_to_food
            y = food_position.y - dist_to_food if bug_position.y < food_position.y else food_position.y + dist_to_food
            self._walk_task = self._task_factory.build_walk_task(self._bug_body, self._map, Point(x,y))

        if self._walk_task.is_done():
            self._walked_to_food = True
            print('walk task done')
        else:
            print('doing walk task')
            self._walk_task.do_step()

    def _do_eat_task(self):
        if not self._eat_task:
            print('creating eat task')
            self._eat_task = self._task_factory.build_eat_task(self._bug_body, self._food)

        if self._eat_task.is_done():
            print('done eat task')
            self.mark_as_done()
        else:
            print('doing eat task')
            self._eat_task.do_step()

        