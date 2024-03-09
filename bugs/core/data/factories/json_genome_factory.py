from .json_genes_factory import JsonGenesFactory
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosome import Chromosome

class JsonGenomeFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory):
        self._json_genes_factory = json_genes_factory

    def build_genome_from_json(self, genome_json: dict) -> Genome:
        maternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['maternal'])
        paternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['paternal']) if genome_json['paternal'] else None
        
        return Genome.build(maternal_chromosomes_set, paternal_chromosomes_set)

    def build_chromosomes_set_from_json(self, chromosomes_set_json: dict) -> ChromosomesSet:
        body_chromosome = self._build_chromosome_from_json(chromosomes_set_json['body'])
        development_chromosome = self._build_chromosome_from_json(chromosomes_set_json['development'])
        adjusting_chromosome = self._build_chromosome_from_json(chromosomes_set_json['adjusting'])
        adaptation_chromosome = self._build_chromosome_from_json(chromosomes_set_json['adaptation'])
        building_chromosome = self._build_chromosome_from_json(chromosomes_set_json['building'])
        combat_chromosome = self._build_chromosome_from_json(chromosomes_set_json['combat'])

        return ChromosomesSet.build(body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)
    
    def _build_chromosome_from_json(self, chromosome_json: dict) -> Chromosome:
        genes = []
        for gene_json in chromosome_json['genes']:
            gene = self._json_genes_factory.build_gene_from_json(gene_json)
            genes.append(gene)

        return Chromosome.build(genes)