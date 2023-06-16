from core.world.entities.base.live_entity.mind import Mind
from .ant_task_factory import AntTaskFactory
from .ant_body import AntBody
from core.world.entities.map import Map
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
import math

class AntMind(Mind):

    def __init__(self, events: EventEmitter, body: AntBody, task_factory: AntTaskFactory, map: Map, memory: Memory, home_nest: Nest):
        super().__init__(events, body, task_factory, map, memory)
        self._home_nest = home_nest

    def prepare_for_operation(self):
        self.toggle_auto_task_generation(False)
        self.force_free()
        task = self._task_factory.build_prepare_for_operation_task(self._home_nest, self._memory, self._calc_assemble_point())
        self._register_task(task, True)

        return task
    
    def leave_operation(self):
        self.force_free()
        self.toggle_auto_task_generation(True)
    
    def walk_to(self, position: Point):
        task = self._task_factory.build_walk_to_task(position)
        self._register_task(task, True)

        return task
    
    def relocate_to_nest(self, nest: Nest):
        self._home_nest = nest
    
    def _calc_assemble_point(self):
        return Point(self._home_nest.position.x, self._home_nest.position.y + 40)
    
    def _generate_tasks(self):
        super()._generate_tasks()
        if not self._has_tasks_to_do() and self._am_i_far_away_from_home():
            go_home_task = self._task_factory.build_go_in_nest_task(self._home_nest)
            self._register_task(go_home_task)

    def _am_i_far_away_from_home(self):
        dist_from_home = math.dist([self._home_nest.position.x, self._home_nest.position.y], [self._body.position.x, self._body.position.y])
        return dist_from_home > self._home_nest.area
