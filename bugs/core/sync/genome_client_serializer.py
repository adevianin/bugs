from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosomes.base.chromosomes_types import ChromosomesTypes
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from .genes_client_serializer import GenesClientSerializer
from core.world.entities.ant.base.genetic.chromosomes.body_chromosome import BodyChromosome
from core.world.entities.ant.base.genetic.chromosomes.development_chromosome import DevelopmentChromosome
from core.world.entities.ant.base.genetic.chromosomes.adaptation_chromosome import AdaptationChromosome
from core.world.entities.ant.base.genetic.chromosomes.building_chromosome import BuildingChromosome
from core.world.entities.ant.base.genetic.chromosomes.combat_chromosome import CombatChromosome
from core.world.entities.ant.base.genetic.chromosomes.adjusting_chromosome import AdjustingChromosome

class GenomeClientSerializer():

    def __init__(self, genes_serializer: GenesClientSerializer):
        self._genes_serializer = genes_serializer

    def serialize_genome(self, genome: Genome):
        return {
            'maternal': self.serialize_chromosomes_set(genome.maternal_chromosomes_set),
            'paternal': self.serialize_chromosomes_set(genome.paternal_chromosomes_set) if genome.paternal_chromosomes_set else None,
            'avaliableAntTypes': genome.get_avaliable_ant_types()
        }

    def serialize_chromosomes_set(self, chromosomes_set: ChromosomesSet):
        return {
            ChromosomesTypes.BODY: self._serialize_body_chromosome(chromosomes_set.body_chromosome),
            ChromosomesTypes.DEVELOPMENT: self._serialize_development_chromosome(chromosomes_set.development_chromosome),
            ChromosomesTypes.ADAPTATION: self._serialize_adaptation_chromosome(chromosomes_set.adaptation_chromosome),
            ChromosomesTypes.BUILDING: self._serialize_building_chromosome(chromosomes_set.building_chromosome),
            ChromosomesTypes.COMBAT: self._serialize_combat_chromosome(chromosomes_set.combat_chromosome),
            ChromosomesTypes.ADJUSTING: self._serialize_adjusting_cromosome(chromosomes_set.adjusting_chromosome)
        }
    
    def _serialize_body_chromosome(self, chromosome: BodyChromosome):
        return {
            'strengthGene': self._genes_serializer.serialize(chromosome.strength_gene),
            'defenseGene': self._genes_serializer.serialize(chromosome.defense_gene),
            'maxHpGene': self._genes_serializer.serialize(chromosome.max_hp_gene),
            'hpRegenRateGene': self._genes_serializer.serialize(chromosome.hp_regen_rate_gene),
            'sightDistanceGene': self._genes_serializer.serialize(chromosome.sight_distance_gene),
            'speedGene': self._genes_serializer.serialize(chromosome.speed_gene)
        }
    
    def _serialize_development_chromosome(self, chromosome: DevelopmentChromosome):
        return {
            'queenCasteGene': self._genes_serializer.serialize(chromosome.queen_cast_gene),
            'workerCasteGene': self._genes_serializer.serialize(chromosome.worker_cast_gene),
            'warriorCasteGene': self._genes_serializer.serialize(chromosome.warrior_cast_gene)
        }
    
    def _serialize_adaptation_chromosome(self, chromosome: AdaptationChromosome):
        return {
        }
    
    def _serialize_building_chromosome(self, chromosome: BuildingChromosome):
        return {
        }
    
    def _serialize_combat_chromosome(self, chromosome: CombatChromosome):
        return {
        }
    
    def _serialize_adjusting_cromosome(self, chromosome: AdjustingChromosome):
        return {
            'appetiteGene': self._genes_serializer.serialize(chromosome.appetite_gene),
            'developmentAppetiteGene': self._genes_serializer.serialize(chromosome.development_appetite_gene)
        }