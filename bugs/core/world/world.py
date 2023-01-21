from threading import Thread
import time

from .map import Map

class World():

    def __init__(self, map: Map) -> None:
        self._map = map
        self._world_loop_stop_flag = False

    def stop(self):
        self._world_loop_stop_flag = True
        print('world is stopped')

    def run(self):
        world_thread = Thread(target=self._run_world_loop)
        world_thread.start()
        print('world is runned')

    def to_json(self):
        entities_json = []
        entities = self._map.get_entities()
        for entity in entities:
            entities_json.append(entity.to_json())
        
        return {
            'entities': entities_json
        }

    def _run_world_loop(self):
        while not self._world_loop_stop_flag:
            iteration_start = time.time()

            self._do_step()

            iteration_end = time.time()
            iteration_time = iteration_end - iteration_start
            
            time.sleep(2 - iteration_time)

    def _do_step(self):
        entities = self._map.get_entities()
        for entity in entities:
            entity.do_step()
        