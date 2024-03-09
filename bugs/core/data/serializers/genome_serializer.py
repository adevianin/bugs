from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from .genes_serializer import GenesSerializer
from core.world.entities.ant.base.genetic.chromosome import Chromosome

class GenomeSerializer():

    def __init__(self, genes_serializer: GenesSerializer):
        self._genes_serializer = genes_serializer

    def serialize_genome(self, genome: Genome):
        return {
            'maternal': self.serialize_chromosomes_set(genome.maternal_chromosomes_set),
            'paternal': self.serialize_chromosomes_set(genome.paternal_chromosomes_set) if genome.paternal_chromosomes_set else None
        }

    def serialize_chromosomes_set(self, chromosomes_set: ChromosomesSet):
        return {
            'body': self._serialize_chromosome(chromosomes_set.body_chromosome),
            'development': self._serialize_chromosome(chromosomes_set.development_chromosome),
            'adaptation': self._serialize_chromosome(chromosomes_set.adaptation_chromosome),
            'building': self._serialize_chromosome(chromosomes_set.building_chromosome),
            'combat': self._serialize_chromosome(chromosomes_set.combat_chromosome),
            'adjusting': self._serialize_chromosome(chromosomes_set.adjusting_chromosome)
        }
    
    def _serialize_chromosome(self, chromosome: Chromosome):
        return {
            'genes': [self._genes_serializer.serialize(gene) for gene in chromosome.genes]
        }