from .entity import Entity
import math
from .point import Point
import random
from .size import Size
from .task import Task
from .task_types import TaskTypes

class Bug(Entity):
    def __init__(self, events, main_event_bus, id, pos):
        super().__init__(id, pos, Size(10, 10))
        self._events = events
        self._main_event_bus = main_event_bus
        self._distance_per_step = 20
        self._tasks = []
        self._distance_per_energy = 0.5

    # def to_json(self):
    #     json = super().to_json()
    #     json.update({
    #     })

    #     return json


    def do_step(self):
        self._replenish_step_energy()

        while self._step_energy > 0:
            self._do_next_task()

        self._emit_change()

    def _do_next_task(self):
        print('do next task')
        if len(self._tasks) == 0:
            self._generate_tasks()

        current_task = self._tasks[0]

        match(current_task.get_type()):
            case TaskTypes.WALK:
                self._do_walk_task(current_task)
            case TaskTypes.SEARCH:
                self._do_search_task(current_task)

    def _do_search_task(self, search_task):
        # look around for search item
        # add walk task to searched item or random point
        pass
        
    
    def _do_walk_task(self, walk_task):
        dest_point = walk_task.get_params()['destination']
        distance = math.dist([self._pos.x, self._pos.y], [dest_point.x, dest_point.y])
        x_distance = dest_point.x - self._pos.x 
        y_distance = dest_point.y - self._pos.y
        needed_energy = distance / self._distance_per_energy
        investing_energy = needed_energy if self._step_energy >= needed_energy else self._step_energy
        self._step_energy -= investing_energy
        distance_can_walk = investing_energy * self._distance_per_energy
        percent_can_walk = (distance_can_walk * 100) / distance

        x_shift = x_distance * percent_can_walk / 100
        y_shift = y_distance * percent_can_walk / 100

        new_pos_x = self._pos.x + x_shift
        new_pos_y = self._pos.y + y_shift

        new_distance = math.dist([new_pos_x, new_pos_y], [dest_point.x, dest_point.y])

        if int(new_distance) == 0:
            self.set_position(dest_point.x, dest_point.y)
            walk_task.mark_as_done()
            self._tasks.remove(walk_task)
        else:
            self.set_position(new_pos_x, new_pos_y)

    def _generate_tasks(self):
        task = Task.create(TaskTypes.WALK, {
            'destination': Point(random.randint(0, 1000), random.randint(0, 500))
        })

        self._tasks.append(task)

    def _emit_change(self):
        self._main_event_bus.emit('entity_changed', self)

    def _replenish_step_energy(self):
        self._step_energy = 100