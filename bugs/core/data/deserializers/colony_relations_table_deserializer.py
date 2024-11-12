from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from typing import Dict

class ColonyRelationsTableDeserializer():

    def deserialize(self, relations_data: Dict) -> ColonyRelationsTable:
        return ColonyRelationsTable.build(relations_data)