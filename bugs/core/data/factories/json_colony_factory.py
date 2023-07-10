from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.base.entity_collection import EntityCollection

class JsonColonyFactory():

    def __init__(self, colony_factory: ColonyFactory):
        self._colony_factory = colony_factory

    def build_colony_from_json(self, colony_json, entities_collection: EntityCollection):
        return self._colony_factory.build_colony(colony_json['id'], colony_json['owner_id'], entities_collection)