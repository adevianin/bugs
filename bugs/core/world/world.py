from threading import Thread
import time

from .map import Map
from .utils.event_emiter import EventEmitter
from .entities.base.entity import Entity
from .settings import STEP_TIME

class World():

    def __init__(self, map: Map, event_bus: EventEmitter) -> None:
        self._map = map
        self._event_bus = event_bus
        self._world_loop_stop_flag = False
        
        self._event_bus.add_listener('entity_died', self._on_entity_died)
        self._event_bus.add_listener('entity_born', self._on_entity_born)

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
            
            if (STEP_TIME - iteration_time > 0):
                time.sleep(STEP_TIME - iteration_time)

    def _do_step(self):
        entities = self._map.get_entities()
        for entity in entities:
            if not entity.is_hidden:
                entity.do_step()

    def _on_entity_died(self, entity: Entity):
        self._map.delete_entity(entity.id)

    def _on_entity_born(self, entity: Entity):
        self._map.add_entity(entity)
        