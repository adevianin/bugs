from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.colony.colonies.ant_colony.operation.base.fight.fight_factory import FightFactory

class FightDeserializer():

    def __init__(self, fight_factory: FightFactory):
        self._fight_factory = fight_factory

    def deserialize_fight(self, json: dict, entities_collection: EntityCollection):
        ants = entities_collection.get_entities(json['ants_ids'])
        return self._fight_factory.build_fight(ants)