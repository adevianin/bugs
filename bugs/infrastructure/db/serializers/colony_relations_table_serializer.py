from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable

class ColonyRelationsTableSerializer():

    def serialize(self, colony_relations_table: ColonyRelationsTable):
        return [self._serialize_relation(relation) for relation in colony_relations_table.relations]

    def _serialize_relation(self, relation):
        return {
            'colony_ids': relation['colony_ids'],
            'value': relation['value'],
            'type': relation['type'].value
        }