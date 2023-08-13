from threading import Thread
import time

from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import STEP_TIME
from core.world.entities.colony.colony import Colony
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from core.world.entities.colony.colony_relations_table import ColonyRelationsTable
from core.world.entities.world.entity_birther import EntityBirther
from core.world.entities.base.entity_types import EntityTypes

from typing import List

class World():

    def __init__(self, id: int, entities_collection: EntityCollection, map: Map, event_bus: EventEmitter, colonies: list[Colony], id_generator: IdGenerator, colony_relations_table: ColonyRelationsTable, entity_birther: EntityBirther):
        self.id = id
        self._entities_collection = entities_collection
        self._map = map
        self._event_bus = event_bus
        self._colonies: List[Colony] = colonies
        self._id_generator = id_generator
        self._world_loop_stop_flag = False
        self._is_world_running = False
        self._step_counter = 0
        self._colony_relations_table = colony_relations_table
        self._entity_birther = entity_birther

        self._current_step_state = None
        self._previous_step_state = None

    @property
    def last_used_id(self):
        return self._id_generator.last_used_id
        
    @property
    def map(self):
        return self._map

    @property
    def is_world_running(self):
        return self._is_world_running
    
    @property
    def colonies(self):
        return self._colonies
    
    @property
    def colony_relations_table(self):
        return self._colony_relations_table
    
    def generate_id(self):
        return self._id_generator.generate_id()
    
    def add_new_colony(self, colony: Colony):
        self._colonies.append(colony)
    
    def get_colony_owned_by_user(self, user_id: int):
        for colony in self._colonies:
            if colony.member_type == EntityTypes.ANT and colony.owner_id == user_id:
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
        entities = self._entities_collection.get_entities()
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

        self._map.handle_intractions()

        self._event_bus.emit('step_start', self._step_counter)
        
        entities = self._entities_collection.get_entities()
        for entity in entities:
            entity.do_step()

        self._step_counter += 1
