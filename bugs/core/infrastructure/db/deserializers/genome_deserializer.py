from .gene_deserializer import GeneDeserializer
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosome import Chromosome
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from typing import List

class GenomeDeserializer():

    def __init__(self, gene_deserializer: GeneDeserializer):
        self._gene_deserializer = gene_deserializer

    def deserialize_genome(self, genome_json: dict) -> Genome:
        maternal_chromosomes_set = self.deserialize_chromosomes_set(genome_json['maternal'])
        paternal_chromosomes_set = self.deserialize_chromosomes_set(genome_json['paternal']) if genome_json['paternal'] else None
        
        return Genome.build(maternal_chromosomes_set, paternal_chromosomes_set)

    def deserialize_chromosomes_set(self, chromosomes_set_json: List[dict]) -> ChromosomesSet:
        chromosomes = []
        for chromosome_json in chromosomes_set_json:
            chromosomes.append(self._deserialize_chromosome(chromosome_json))

        return ChromosomesSet.build(chromosomes)
    
    def _deserialize_chromosome(self, chromosome_json: dict) -> Chromosome:
        type = ChromosomeTypes(chromosome_json['type'])
        
        genes = []
        for gene_json in chromosome_json['genes']:
            gene = self._gene_deserializer.deserialize_gene(gene_json)
            genes.append(gene)

        return Chromosome.build(type, genes)