from core.world.entities.ant.base.genome.genome import Genome
from core.world.entities.ant.base.genome.chromosomes_types import ChromosomesTypes
from core.world.entities.ant.base.genome.chromosome import Chromosome
from core.world.entities.ant.base.genome.chromosomes_set import ChromosomesSet
from .genes_serializer import GenesSerializer

from typing import Dict

class GenomeSerializer():

    def __init__(self, genes_serializer: GenesSerializer):
        self._genes_serializer = genes_serializer

    def serialize(self, genome: Genome):
        return {
            'maternal': self._serialize_chromosomes_set(genome.maternal_chromosomes_set),
            'paternal': self._serialize_chromosomes_set(genome.paternal_chromosomes_set)
        }

    def _serialize_chromosomes_set(self, chromosomes_set: ChromosomesSet):
        base_chromosome = chromosomes_set.base_chromosome
        base_chromosome_json = [self._genes_serializer.serialize(gene) for gene in base_chromosome.genes]
        
        base_chromosome = chromosomes_set.development_chromosome
        development_chromosome_json = [self._genes_serializer.serialize(gene) for gene in base_chromosome.genes]

        base_chromosome = chromosomes_set.adaptation_chromosome
        adaptation_chromosome_json = [self._genes_serializer.serialize(gene) for gene in base_chromosome.genes]

        base_chromosome = chromosomes_set.building_chromosome
        building_chromosome_json = [self._genes_serializer.serialize(gene) for gene in base_chromosome.genes]

        base_chromosome = chromosomes_set.combat_chromosome
        combat_chromosome_json = [self._genes_serializer.serialize(gene) for gene in base_chromosome.genes]

        return {
            ChromosomesTypes.BASE: base_chromosome_json,
            ChromosomesTypes.DEVELOPMENT: development_chromosome_json,
            ChromosomesTypes.ADAPTATION: adaptation_chromosome_json,
            ChromosomesTypes.BUILDING: building_chromosome_json,
            ChromosomesTypes.COMBAT: combat_chromosome_json
        }