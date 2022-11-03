from .point import Point
from threading import Thread
import time

class World:

    def __init__(self, bugs, blocks):
        World._instance = self
        self.bugs = bugs
        self._world_loop_stop_flag = False
        self._blocks = blocks

    def run(self):
        # self.bugs[0].plan_jump()
        # bug = self.bugs[0]
        # bug.walk_path([
        #     Point(90, 40),
        #     Point(90, 90),
        #     Point(150, 150),
        #     Point(250, 150)
        # ])

        bug = self.bugs[1]
        bug.walk_to(250, 150)

        # bug.events.on('arrived', self.on_arrived)

        world_thread = Thread(target=self._run_world_loop)
        world_thread.start()
        print('world is runned')

    def stop(self):
        self._world_loop_stop_flag = True
        print('world is stopped')

    def on_arrived(self):
        print('arrived1')
        
    def to_json(self):
        bugs_json = []
        for bug in self.bugs:
            bugs_json.append(bug.to_json())

        blocks_json = []
        for block in self._blocks:
            blocks_json.append(block.to_json())

        return {
            'bugs': bugs_json,
            'blocks': blocks_json
        }

    def _run_world_loop(self):
        ips = 2
        while not self._world_loop_stop_flag:
            iteration_start = time.time()
            for bug in self.bugs:
                bug.update()

            iteration_end = time.time()
            iteration_time = iteration_end - iteration_start

            time.sleep(1/ips - iteration_time)
