from .json_genes_factory import JsonGenesFactory
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosome import Chromosome
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from typing import List

class JsonGenomeFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory):
        self._json_genes_factory = json_genes_factory

    def build_genome_from_json(self, genome_json: dict) -> Genome:
        maternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['maternal'])
        paternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['paternal']) if genome_json['paternal'] else None
        
        return Genome.build(maternal_chromosomes_set, paternal_chromosomes_set)

    def build_chromosomes_set_from_json(self, chromosomes_set_json: List[dict]) -> ChromosomesSet:
        chromosomes = []
        for chromosome_json in chromosomes_set_json:
            chromosomes.append(self._build_chromosome_from_json(chromosome_json))

        return ChromosomesSet.build(chromosomes)
    
    def _build_chromosome_from_json(self, chromosome_json: dict) -> Chromosome:
        type = ChromosomeTypes(chromosome_json['type'])
        
        genes = []
        for gene_json in chromosome_json['genes']:
            gene = self._json_genes_factory.build_gene_from_json(gene_json)
            genes.append(gene)

        return Chromosome.build(type, genes)