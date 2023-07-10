from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.base.entity_types import EntityTypes

class ColonyAntsCollection():

    @classmethod
    def build_colony_ants_collection(cls, entities_collection: EntityCollection, colony_id: int):
        return ColonyAntsCollection(entities_collection, colony_id)

    def __init__(self, entities_collection: EntityCollection, colony_id: int):
        self._entities_collection = entities_collection
        self._colony_id = colony_id

    @property
    def ants(self):
        return self._get_ants_from_colony()

    def _get_ants_from_colony(self):
        found_ants = []
        for entity in self._entities_collection.get_entities():
            if entity.type == EntityTypes.ANT and entity.from_colony == self._colony_id:
                found_ants.append(entity)

        return found_ants
