from .json_genes_factory import JsonGenesFactory
from core.world.entities.ant.base.genome.chromosome import Chromosome
from core.world.entities.ant.base.genome.chromosomes_types import ChromosomesTypes
from core.world.entities.ant.base.genome.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genome.genome import Genome

class JsonGenomeFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory):
        self._json_genes_factory = json_genes_factory

    def build_genome_from_json(self, genome_json: dict) -> Genome:
        maternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['maternal'])
        paternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['paternal'])
        
        return Genome.build(maternal_chromosomes_set, paternal_chromosomes_set)

    def build_chromosomes_set_from_json(self, chromosomes_set_json: dict) -> ChromosomesSet:
        genes_json = chromosomes_set_json[ChromosomesTypes.BASE]
        genes = [self._json_genes_factory.build_gene_from_json(gene_json) for gene_json in genes_json]
        base_chromosome = Chromosome.build(genes)
        
        genes_json = chromosomes_set_json[ChromosomesTypes.DEVELOPMENT]
        genes = [self._json_genes_factory.build_gene_from_json(gene_json) for gene_json in genes_json]
        development_chromosome = Chromosome.build(genes)

        genes_json = chromosomes_set_json[ChromosomesTypes.ADAPTATION]
        genes = [self._json_genes_factory.build_gene_from_json(gene_json) for gene_json in genes_json]
        adaptation_chromosome = Chromosome.build(genes)

        genes_json = chromosomes_set_json[ChromosomesTypes.BUILDING]
        genes = [self._json_genes_factory.build_gene_from_json(gene_json) for gene_json in genes_json]
        building_chromosome = Chromosome.build(genes)

        genes_json = chromosomes_set_json[ChromosomesTypes.COMBAT]
        genes = [self._json_genes_factory.build_gene_from_json(gene_json) for gene_json in genes_json]
        combat_chromosome = Chromosome.build(genes)

        return ChromosomesSet.build(base_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome)
