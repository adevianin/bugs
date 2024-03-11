from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_builder import SpecieBuilder
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_schema import SpecieSchema
from core.world.entities.ant.base.nuptial_environment.specie_builder.gene_entry import GeneEntry
from .genome_client_serializer import GenomeClientSerializer
from .genes_client_serializer import GenesClientSerializer
from .stats_client_serializer import StatsClientSerializer
from core.world.nuptial_environment_client_serializer_interface import iNuptialEnvironmentClientSerializer
from typing import List

class NuptialEnvironmentClientSerializer(iNuptialEnvironmentClientSerializer):

    def __init__(self, genome_serializer: GenomeClientSerializer, genes_serializer: GenesClientSerializer, stats_serializer: StatsClientSerializer):
        self._genome_serializer = genome_serializer
        self._genes_serializer = genes_serializer
        self._stats_serializer = stats_serializer

    def serialize_nuptial_male(self, nuptial_male: NuptialMale) -> dict:
        return {
            'id': nuptial_male.id,
            'genome': self._genome_serializer.serialize_genome(nuptial_male.genome),
            'stats': self._stats_serializer.serialize(nuptial_male.stats),
        }
    
    def serialize_nuptial_males(self, nuptial_males: List[NuptialMale]) -> List[dict]:
        return [self.serialize_nuptial_male(nuptial_male) for nuptial_male in nuptial_males]
    
    def serialize_specie_builder(self, specie_builder: SpecieBuilder):
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
