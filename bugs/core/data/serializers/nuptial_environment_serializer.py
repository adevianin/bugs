from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .genes_serializer import GenesSerializer
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_builder import SpecieBuilder
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_schema import SpecieSchema
from core.world.entities.ant.base.nuptial_environment.specie_builder.gene_entry import GeneEntry

class NuptialEnvironmentSerializer():

    def __init__(self, genes_serializer: GenesSerializer):
        self._genes_serializer = genes_serializer

    def serialize(self, nuptial_environment: NuptialEnvironment):
        return {
            'owner_id': nuptial_environment.owner_id,
            'specie': self._serialize_specie_builder(nuptial_environment.specie_builder)
        }
    
    def _serialize_specie_builder(self, specie_builder: SpecieBuilder):
        return {
            'schema': self._serialize_schema(specie_builder.schema),
            'genes_entries': [self._serialize_gene_entry(gene_entry) for gene_entry in specie_builder.genes_entries]
        }
    
    def _serialize_schema(self, specie_schema: SpecieSchema):
        return {
            'body': specie_schema.body_schema,
            'development': specie_schema.development_schema,
            'adaptation': specie_schema.adaptation_schema,
            'building': specie_schema.building_schema,
            'combat': specie_schema.combat_schema,
            'adjusting': specie_schema.adjusting_schema,
        }
    
    def _serialize_gene_entry(self, gene_entry: GeneEntry):
        return {
            'id': gene_entry.id,
            'gene': self._genes_serializer.serialize(gene_entry.gene)
        }