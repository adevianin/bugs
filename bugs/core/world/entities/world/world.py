from threading import Thread
import time

from core.world.entities.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.entity import Entity
from core.world.settings import STEP_TIME
from core.world.entities.colony.colony import Colony

class World():

    def __init__(self, map: Map, event_bus: EventEmitter, colonies: list[Colony]) -> None:
        self._map = map
        self._event_bus = event_bus
        self._colonies = colonies
        self._world_loop_stop_flag = False
        self._is_world_running = False
        self._step_counter = 0

        self._current_step_state = None
        self._previous_step_state = None
        
        self._event_bus.add_listener('entity_died', self._on_entity_died)
        self._event_bus.add_listener('entity_born', self._on_entity_born)

    @property
    def map(self):
        return self._map

    @property
    def is_world_running(self):
        return self._is_world_running
    
    def get_colony_owned_by_user(self, user_id: int):
        for colony in self._colonies:
            if colony.owner_id == user_id:
                return colony
            
        return None

    def stop(self):
        if (not self._is_world_running): 
            return
        self._world_loop_stop_flag = True
        self._is_world_running = False

    def run(self):
        if (self._is_world_running):
            return
        world_thread = Thread(target=self._run_world_loop)
        world_thread.start()
        self._world_loop_stop_flag = False
        self._is_world_running = True

    def to_public_json(self):
        entities_json = []
        entities = self._map.get_entities()
        for entity in entities:
            entities_json.append(entity.to_public_json())

        colonies_json = []
        for colony in self._colonies:
            colonies_json.append(colony.to_public_json())
        
        return {
            'entities': entities_json,
            'colonies': colonies_json,
            'size': self._map.size
        }
    
    # def to_user_json(self, user_id: int):
    #     entities_json = []
    #     entities = self._map.get_entities()
    #     for entity in entities:
    #         entities_json.append(entity.to_public_json())

    #     my_colony = next(colony for colony in self._colonies if colony.owner_id == user_id)
        
    #     return {
    #         'entities': entities_json,
    #         'my_colony': my_colony.to_public_json(),
    #         'size': self._map.size
    #     }

    
    def _run_world_loop(self):
        while not self._world_loop_stop_flag:
            iteration_start = time.time()

            self._do_step()

            iteration_end = time.time()
            iteration_time = iteration_end - iteration_start
            
            if (STEP_TIME - iteration_time > 0):
                time.sleep(STEP_TIME - iteration_time)

    def _do_step(self):
        print(f'step { self._step_counter } start')

        self._event_bus.emit('step_start', self._step_counter)
        
        entities = self._map.get_entities()
        for entity in entities:
            entity.do_step()

        self._step_counter += 1

    def _on_entity_died(self, entity: Entity):
        self._map.delete_entity(entity.id)

    def _on_entity_born(self, entity: Entity):
        self._map.add_entity(entity)
        