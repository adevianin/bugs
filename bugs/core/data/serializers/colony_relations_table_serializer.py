from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable

class ColonyRelationsTableSerializer():

    def serialize(self, colony_relations_table: ColonyRelationsTable):
        return colony_relations_table.relations_data