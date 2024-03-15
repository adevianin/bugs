from .specie_chromosome_set import SpecieChromosomeSet
from .specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.genetic.genome import Genome
from .specie_schema import SpecieSchema

from typing import List

class Specie():

    @classmethod
    def build(self, chromosome_set: SpecieChromosomeSet):
        return Specie(chromosome_set)

    def __init__(self, chromosome_set: SpecieChromosomeSet):
        self._chromosome_set = chromosome_set

    @property
    def specie_chromosome_set(self) -> SpecieChromosomeSet:
        return self._chromosome_set
    
    def accept_male_genome(self, genome: Genome):
        maternal_chromosome_set = genome.maternal_chromosomes_set
        self._chromosome_set.accept_chromosome_set(maternal_chromosome_set)
    
    def generate_male_genome(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> Genome:
        maternal_chromosome = self._chromosome_set.generate_chorosome_set(percent, super_mutate_chance, super_mutate_percent)
        return Genome.build(maternal_chromosome, None)
    
    def apply_schema(self, schema: SpecieSchema):
        print(schema)
        pass

    # def _validate_specie_schema(self, schema: SpecieSchema):
    #     schema.body_schema
    #     self._chromosome_set.body_specie_chromosome

    # def _validate_chromosome_schema(chromosome_schema: List[str], specie_chromosome: SpecieChromosome):
    #     types_register = {}
    #     for specie_gene_id in chromosome_schema:
    #         specie_gene = specie_chromosome.get_specie_gene_by_id(specie_gene_id)

    #         if specie_gene is None:
    #             return False
            
    #         if specie_gene.gene.type in types_register:
    #             return False
    #         else:
    #             types_register[specie_gene.gene.type] = 1

    #     return True

    

    
