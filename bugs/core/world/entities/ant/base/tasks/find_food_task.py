from core.world.entities.base.live_entity.tasks.task import Task
from ..ant_body import AntBody
from core.world.entities.base.entity_types import EntityTypes
from core.world.map import Map
from .searching_walk_task import SearchingWalkTask
from core.world.entities.base.live_entity.memory import Memory

import math

class FindFoodTask(Task):

    def __init__(self, body: AntBody, map: Map, memory: Memory, random_walk_task: SearchingWalkTask):
        super().__init__(body)
        self._map = map
        self._memory = memory
        self._random_walk_task = random_walk_task

        self._points_to_check = []

        self._reset_flags()

    def do_step(self):
        found_food = self._look_around_for_food()
        if (found_food):
            return
        
        if (not self._memory_read):
            self._points_to_check = self._get_points_to_check()
            self._memory_read = True

        if (not self._points_checked):
            if (len(self._points_to_check) > 0):
                checking_point = self._points_to_check[0]
                got_to_point = self._body.step_to_near(checking_point)
                if (got_to_point):
                    self._points_to_check.pop(0)
                    self._look_around_for_food()
                return
            else:
                self._points_checked = True
        if (self._points_checked):
            self._random_walk_task.do_step()
            self._look_around_for_food()

    def restart(self):
        super().restart()
        self._reset_flags()
    
    def _get_points_to_check(self):
        entities_data = self._memory.get_entities_data([EntityTypes.FOOD, EntityTypes.FOOD_AREA])
        positions = []
        for entity_data in entities_data:
            positions.append(entity_data['position'])

        positions.sort(key=lambda position: math.dist([position.x, position.y], [self._body.position.x, self._body.position.y]))

        return positions

    def _look_around_for_food(self):
        foods = self._map.find_entities_near(self._body.position, self._body.sight_distance, [EntityTypes.FOOD])

        if (len(foods) > 0):
            self.mark_as_done(foods[0])
            return True
        else:
            return False

    def _reset_flags(self):
        self._memory_read = False
        self._points_checked = False
        

    
