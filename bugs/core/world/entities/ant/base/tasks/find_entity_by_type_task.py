from core.world.entities.task.task import Task
from ..ant_body import AntBody
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.map import Map
from .searching_walk_task import SearchingWalkTask

class FindEntityByTypeTask(Task):

    def __init__(self, body: AntBody, entity_type: EntityTypes, map: Map, searching_walk_task: SearchingWalkTask):
        super().__init__(body)
        self._searching_entity_type = entity_type
        self._map = map
        self._searching_walk_task = searching_walk_task

    def do_step(self):
        searching_entities = self._map.find_entities_near(self._body.position, self._body.sight_distance, [self._searching_entity_type])
        
        if (len(searching_entities) > 0):
            self.mark_as_done(searching_entities)
        else:
            self._searching_walk_task.do_step()

    

    

    
