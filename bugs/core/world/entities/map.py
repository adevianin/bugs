from core.world.entities.base.entity import Entity
from core.world.utils.size import Size
from core.world.utils.point import Point
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator

from typing import List
import random, math

class Map:

    @classmethod
    def build_map(cls, size: Size, entities_collection: EntityCollection, id_generator: IdGenerator):
        return Map(size, entities_collection, id_generator)

    def __init__(self, size: Size, entities_collection: EntityCollection, id_generator: IdGenerator):
        self._size = size
        self._entities_collection = entities_collection
        self._id_generator = id_generator

    def get_entity_by_id(self, id: int):
        return self._entities_collection.get_entity_by_id(id)
    
    def get_ants_from_colony(self, colony_id: int, ant_type: AntTypes = None):
        found_ants = []
        for entity in self._entities_collection.get_entities():
            if entity.type == EntityTypes.ANT and entity.from_colony == colony_id and (ant_type == None or entity.ant_type == ant_type):
                found_ants.append(entity)

        return found_ants

    def handle_intractions(self):
        ants = self.get_entities_by_type(EntityTypes.ANT)
        for ant in ants:
            entities_in_sight = self._find_entities_in_sight(ant)
            ant.mind.set_entities_in_sight(entities_in_sight)

    def give_birth_entity(self, entity: Entity):
        entity.id = self._id_generator.generate_id()
        self._entities_collection.add_entity(entity)
        entity.born()

    def die_entity(self, entity: Entity):
        self._entities_collection.delete_entity(entity.id)

    # def add_entity(self, entity: Entity):
    #     self._entities[entity.id] = entity

    # def delete_entity(self, id: int):
    #     self._entities.pop(id)

    # def get_entity_by_id(self, id: int) -> Entity:
    #     return self._entities[id]

    # def get_entities(self) -> List[Entity]:
    #     return list(self._entities.values())

    # def generate_random_point(self):
    #     x = random.randint(0, self._size.width)
    #     y = random.randint(0, self._size.height)
        
    #     return Point(x, y)

    # def is_point_walkable(self, point: Point):
    #     is_x_valid = point.x >= 0 and point.x <= self._size.width
    #     is_y_valid = point.y >= 0 and point.y <= self._size.height

    #     return is_x_valid and is_y_valid
    
    def _find_entities_in_sight(self, entity: LiveEntity):
        return self._find_entities_near(point=entity.position, max_distance=entity.body.sight_distance, exclude_entity_id=entity.id)

    def _find_entities_near(self, point: Point, max_distance: int, entity_types: List[EntityTypes] = None, exclude_entity_id: int = None):
        found_entities = []
        for entity in self._entities_collection.get_entities():
            dist = math.dist([entity.position.x, entity.position.y], [point.x, point.y])
            is_type_suitable = True if entity_types == None else self._check_entity_type(entity, entity_types)
            is_excluded = False if exclude_entity_id == None else exclude_entity_id == entity.id

            if (not entity.is_hidden and dist <= max_distance and is_type_suitable and not is_excluded):
                found_entities.append(entity)

        return found_entities
    
    # def get_entities_from_nest(self, nest_id: int):
    #     found_entities = []
    #     for entity in self.get_entities():
    #         if hasattr(entity, 'located_in_nest_id') and entity.located_in_nest_id == nest_id:
    #             found_entities.append(entity)

    #     return found_entities
    
    
    
    # def get_nests_from_colony(self, colony_id: int):
    #     found_nests = []
    #     for entity in self.get_entities():
    #         if entity.type == EntityTypes.NEST and entity.from_colony == colony_id:
    #             found_nests.append(entity)

    #     return found_nests
    
    def get_entities_by_type(self, entity_type: EntityTypes):
        found_entities = []
        for entity in self._entities_collection.get_entities():
            if entity.type == entity_type:
                found_entities.append(entity)
        return found_entities
    
    @property
    def size(self):
        return self._size
    
    def to_full_json(self):
        return {
            'size': {
                'width': self._size.width, 
                'height': self._size.height
            }
        }
    
    def _check_entity_type(self, entity: Entity, entity_types: EntityTypes):
        for type in entity_types:
            if (entity.type == type):
                return True
            
        return False
    