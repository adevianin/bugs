from threading import Thread
import time

class World:

    def __init__(self, main_event_bus, map, bugs, food_grower):
        World._instance = self
        self._map = map
        self._bugs = bugs
        self._world_loop_stop_flag = False
        self._food_grower = food_grower
        self._main_event_bus = main_event_bus

        self._main_event_bus.add_listener('eaten', self._on_food_eaten)

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

        towns_json = []
        for town in self._map.get_towns():
            towns_json.append(town.to_json())

        return {
            'bugs': bugs_json,
            'foods': foods_json,
            'towns': towns_json,
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

    def _on_food_eaten(self, food_entity):
        self._map.remove_food(food_entity)

        
