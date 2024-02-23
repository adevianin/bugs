from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosome.chromosomes_types import ChromosomesTypes
from core.world.entities.ant.base.genetic.chromosome.chromosomes_set import ChromosomesSet
from .genes_client_serializer import GenesClientSerializer

class GenomeClientSerializer():

    def __init__(self, genes_serializer: GenesClientSerializer):
        self._genes_serializer = genes_serializer

    def serialize_genome(self, genome: Genome):
        return {
            'maternal': self.serialize_chromosomes_set(genome.maternal_chromosomes_set),
            'paternal': self.serialize_chromosomes_set(genome.paternal_chromosomes_set)
        }

    def serialize_chromosomes_set(self, chromosomes_set: ChromosomesSet):
        base_chromosome = chromosomes_set.base_chromosome
        base_chromosome_json = [self._genes_serializer.serialize(gene) for gene in base_chromosome.genes]
        
        development_chromosome = chromosomes_set.development_chromosome
        development_chromosome_json = [self._genes_serializer.serialize(gene) for gene in development_chromosome.genes]

        adaptation_chromosome = chromosomes_set.adaptation_chromosome
        adaptation_chromosome_json = [self._genes_serializer.serialize(gene) for gene in adaptation_chromosome.genes]

        building_chromosome = chromosomes_set.building_chromosome
        building_chromosome_json = [self._genes_serializer.serialize(gene) for gene in building_chromosome.genes]

        combat_chromosome = chromosomes_set.combat_chromosome
        combat_chromosome_json = [self._genes_serializer.serialize(gene) for gene in combat_chromosome.genes]

        adjusting_chromosome = chromosomes_set.adjusting_chromosome
        adjusting_chromosome_json = [self._genes_serializer.serialize(gene) for gene in adjusting_chromosome.genes]

        return {
            ChromosomesTypes.BASE: base_chromosome_json,
            ChromosomesTypes.DEVELOPMENT: development_chromosome_json,
            ChromosomesTypes.ADAPTATION: adaptation_chromosome_json,
            ChromosomesTypes.BUILDING: building_chromosome_json,
            ChromosomesTypes.COMBAT: combat_chromosome_json,
            ChromosomesTypes.ADJUSTING: adjusting_chromosome_json
        }