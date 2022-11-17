from .base_task import BaseTask
import math

class WalkTask(BaseTask):
    
    def __init__(self, task_factory, bug_body, map, dest_point):
        super().__init__(task_factory, bug_body)
        self._map = map
        self._dest_point = dest_point

    def do_step(self):
        bug_body_pos = self._bug_body.get_position()
        bug_step_energy = self._bug_body.get_step_energy()
        bug_distance_per_energy = self._bug_body.get_distance_per_energy()
        distance = math.dist([bug_body_pos.x, bug_body_pos.y], [self._dest_point.x, self._dest_point.y])
        x_distance = self._dest_point.x - bug_body_pos.x 
        y_distance = self._dest_point.y - bug_body_pos.y
        needed_energy = distance / bug_distance_per_energy
        investing_energy = needed_energy if bug_step_energy >= needed_energy else bug_step_energy
        investing_energy = math.ceil(investing_energy)
        self._bug_body.consume_step_energy(investing_energy)
        distance_can_walk = investing_energy * bug_distance_per_energy
        percent_can_walk = (distance_can_walk * 100) / distance

        x_shift = x_distance * percent_can_walk / 100
        y_shift = y_distance * percent_can_walk / 100

        new_pos_x = bug_body_pos.x + x_shift
        new_pos_y = bug_body_pos.y + y_shift

        new_distance = math.dist([new_pos_x, new_pos_y], [self._dest_point.x, self._dest_point.y])

        if int(new_distance) == 0:
            self._bug_body.set_position(self._dest_point.x, self._dest_point.y)
            self.mark_as_done()
        else:
            self._bug_body.set_position(new_pos_x, new_pos_y)