from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .genes_serializer import GenesSerializer
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_gene import SpecieGene

class NuptialEnvironmentSerializer():

    def __init__(self, genes_serializer: GenesSerializer):
        self._genes_serializer = genes_serializer

    def serialize(self, nuptial_environment: NuptialEnvironment):
        return {
            'owner_id': nuptial_environment.owner_id,
            'specie': self._serialize_specie(nuptial_environment.specie)
        }
    
    def _serialize_specie(self, specie: Specie):
        return {
            'body': self._serialize_specie_chromosome(specie.specie_chromosome_set.body_specie_chromosome),
            'development': self._serialize_specie_chromosome(specie.specie_chromosome_set.development_specie_chromosome),
            'adaptation': self._serialize_specie_chromosome(specie.specie_chromosome_set.adaptation_specie_chromosome),
            'building': self._serialize_specie_chromosome(specie.specie_chromosome_set.building_specie_chromosome),
            'combat': self._serialize_specie_chromosome(specie.specie_chromosome_set.combat_specie_chromosome),
            'adjusting': self._serialize_specie_chromosome(specie.specie_chromosome_set.adjusting_specie_chromosome),
        }
    
    def _serialize_specie_chromosome(self, specie_chromosome: SpecieChromosome):
        return {
            'activated_specie_genes_ids': specie_chromosome.activated_specie_genes_ids,
            'specie_genes': [self._serialize_specie_gene(specie_gene) for specie_gene in specie_chromosome.specie_genes]
        }
    
    def _serialize_specie_gene(self, specie_gene: SpecieGene):
        return {
            'id': specie_gene.id,
            'gene': self._genes_serializer.serialize(specie_gene.gene)
        }