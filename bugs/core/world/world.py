from threading import Thread
import time

class World:

    def __init__(self, map, bugs, food_grower):
        World._instance = self
        self._map = map
        self._bugs = bugs
        self._world_loop_stop_flag = False
        self._food_grower = food_grower

    def run(self):
        world_thread = Thread(target=self._run_world_loop)
        world_thread.start()
        print('world is runned')

    def stop(self):
        self._world_loop_stop_flag = True
        print('world is stopped')

    def to_json(self):
        bugs_json = []
        for bug in self._bugs:
            bugs_json.append(bug.to_json())

        foods_json = []
        for food in self._map.get_foods():
            foods_json.append(food.to_json())

        return {
            'bugs': bugs_json,
            'foods': foods_json,
            'blocks': []
        }

    def _run_world_loop(self):
        while not self._world_loop_stop_flag:
            iteration_start = time.time()

            self._food_grower.do_grow_step()

            for bug in self._bugs:
                bug.do_step()

            iteration_end = time.time()
            iteration_time = iteration_end - iteration_start
            
            time.sleep(2 - iteration_time)

        
