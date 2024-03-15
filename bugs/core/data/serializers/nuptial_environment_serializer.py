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
            'chromosomes_set': [self._serialize_specie_chromosome(specie_chromosome) for specie_chromosome in specie.specie_chromosome_set.specie_chromosomes]
        }
    
    def _serialize_specie_chromosome(self, specie_chromosome: SpecieChromosome):
        return {
            'type': specie_chromosome.type,
            'activated_specie_genes_ids': specie_chromosome.activated_specie_genes_ids,
            'specie_genes': [self._serialize_specie_gene(specie_gene) for specie_gene in specie_chromosome.specie_genes]
        }
    
    def _serialize_specie_gene(self, specie_gene: SpecieGene):
        return {
            'id': specie_gene.id,
            'gene': self._genes_serializer.serialize(specie_gene.gene)
        }