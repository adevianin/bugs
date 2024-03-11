from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .json_genes_factory import JsonGenesFactory
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_builder import SpecieBuilder
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_schema import SpecieSchema
from core.world.entities.ant.base.nuptial_environment.specie_builder.gene_entry import GeneEntry

class JsonNuptialEnvironmentFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory):
        self._json_genes_factory = json_genes_factory

    def build_nuptial_environment_from_json(self, json: dict):
        owner_id = json['owner_id']
        specie_builder = self._build_specie_builder(json['specie'])
        return NuptialEnvironment.build(owner_id, specie_builder)
    
    def _build_specie_builder(self, specie_json: dict):
        schema = self._build_schema(specie_json['schema'])
        genes_entries_json = specie_json['genes_entries']
        genes_entries = [self._build_gene_entry(gene_entry_json) for gene_entry_json in genes_entries_json]
        return SpecieBuilder.build(schema, genes_entries)
    
    def _build_schema(self, schema_json: dict):
        return SpecieSchema.build(schema_json['body'], schema_json['development'], schema_json['adaptation'], schema_json['building'], schema_json['combat'], schema_json['adjusting'])
    
    def _build_gene_entry(self, gene_entry_json: dict):
        gene = self._json_genes_factory.build_gene_from_json(gene_entry_json['gene'])
        return GeneEntry.build(gene_entry_json['id'], gene)
