from .specie_chromosome_set import SpecieChromosomeSet
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

from typing import List, Dict

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
    
    def apply_schema(self, schema: Dict[ChromosomeTypes, List[str]]):
        for chromosome_type in schema:
            ids = schema[chromosome_type]
            specie_chromosome = self._chromosome_set.get_specie_chromosome_by_type(chromosome_type)
            specie_chromosome.apply_schema(ids)
        
    def validate_schema(self, schema: Dict[ChromosomeTypes, List[str]]):
        for chromosome_type in schema:
            schema_ids = schema[chromosome_type]
            specie_chromosome = self._chromosome_set.get_specie_chromosome_by_type(chromosome_type)

            if not specie_chromosome.validate_schema(schema_ids):
                return False

        return True
