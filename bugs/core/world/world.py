from .point import Point
from threading import Thread
import time

class World:

    def __init__(self, map):
        World._instance = self
        self._map = map
        self._world_loop_stop_flag = False

    def run(self):
        world_thread = Thread(target=self._run_world_loop)
        world_thread.start()
        print('world is runned')

    def stop(self):
        self._world_loop_stop_flag = True
        print('world is stopped')

    def to_json(self):
        bugs_json = []
        for bug in self._map.get_bugs():
            bugs_json.append(bug.to_json())

        return {
            'bugs': bugs_json,
            'blocks': []
        }

    def _run_world_loop(self):
        while not self._world_loop_stop_flag:
            iteration_start = time.time()
            for bug in self._map.get_bugs():
                bug.do_step()

            iteration_end = time.time()
            iteration_time = iteration_end - iteration_start
            print(iteration_time)
            time.sleep(3 - iteration_time)

        
