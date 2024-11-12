from core.world.entities.colony.base.colony_relations_table_factory import ColonyRelationsTableFactory
from typing import Dict

class ColonyRelationsDeserializer():

    def __init__(self, colony_relations_table_factory: ColonyRelationsTableFactory):
        self._colony_relations_table_factory = colony_relations_table_factory

    def deserialize(self, json: Dict) -> ColonyRelationsTableFactory:
        return self._colony_relations_table_factory.build_relations_table(json)