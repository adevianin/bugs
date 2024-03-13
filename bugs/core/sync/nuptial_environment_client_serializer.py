from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_gene import SpecieGene
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
    
    def serialize_specie(self, specie: Specie):
        return {
            'body': self._serialize_specie_chromosome(specie.specie_chromosome_set.body_specie_chromosome),
            'development': self._serialize_specie_chromosome(specie.specie_chromosome_set.development_specie_chromosome),
            'adaptation': self._serialize_specie_chromosome(specie.specie_chromosome_set.adaptation_specie_chromosome),
            'building': self._serialize_specie_chromosome(specie.specie_chromosome_set.building_specie_chromosome),
            'combat': self._serialize_specie_chromosome(specie.specie_chromosome_set.combat_specie_chromosome),
            'adjusting': self._serialize_specie_chromosome(specie.specie_chromosome_set.adjusting_specie_chromosome),
        }
    
    def _serialize_specie_chromosome(self, chromosome: SpecieChromosome):
        return {
            'activated_specie_genes_ids': chromosome.activated_specie_genes_ids,
            'specie_genes': [self._serialize_specie_gene(specie_gene) for specie_gene in chromosome.specie_genes]
        }
    
    def _serialize_specie_gene(self, specie_gene: SpecieGene):
        return {
            'id': specie_gene.id,
            'gene': self._genes_serializer.serialize(specie_gene.gene)
        }