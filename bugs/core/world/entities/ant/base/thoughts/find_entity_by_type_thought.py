from core.world.entities.thought.thought import Thought
from ..ant_body import AntBody
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.map import Map
from .searching_walk_thought import SearchingWalkThought

class FindEntityByTypeThought(Thought):

    def __init__(self, body: AntBody, map: Map, entity_type: EntityTypes, searching_walk_thought: SearchingWalkThought):
        super().__init__(body, map)
        self._searching_entity_type = entity_type
        self._searching_walk_thought = searching_walk_thought

    def do_step(self):
        searching_entities = self._map.find_entities_near(self._body.position, self._body.sight_distance, [self._searching_entity_type])
        
        if (len(searching_entities) > 0):
            self.mark_as_done(searching_entities)
        else:
            self._searching_walk_thought.do_step()

    

    

    
