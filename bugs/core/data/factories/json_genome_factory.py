from .json_genes_factory import JsonGenesFactory
from core.world.entities.ant.base.genetic.chromosomes.base.chromosomes_types import ChromosomesTypes
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosomes.body_chromosome import BodyChromosome
from core.world.entities.ant.base.genetic.chromosomes.development_chromosome import DevelopmentChromosome
from core.world.entities.ant.base.genetic.chromosomes.adjusting_chromosome import AdjustingChromosome
from core.world.entities.ant.base.genetic.chromosomes.adaptation_chromosome import AdaptationChromosome
from core.world.entities.ant.base.genetic.chromosomes.building_chromosome import BuildingChromosome
from core.world.entities.ant.base.genetic.chromosomes.combat_chromosome import CombatChromosome

class JsonGenomeFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory):
        self._json_genes_factory = json_genes_factory

    def build_genome_from_json(self, genome_json: dict) -> Genome:
        maternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['maternal'])
        paternal_chromosomes_set = self.build_chromosomes_set_from_json(genome_json['paternal'])
        
        return Genome.build(maternal_chromosomes_set, paternal_chromosomes_set)

    def build_chromosomes_set_from_json(self, chromosomes_set_json: dict) -> ChromosomesSet:
        body_chromosome = self._build_body_chromosome(chromosomes_set_json[ChromosomesTypes.BODY])
        development_chromosome = self._build_development_chromosome(chromosomes_set_json[ChromosomesTypes.DEVELOPMENT])
        adjusting_chromosome = self._build_adjusting_chromosome(chromosomes_set_json[ChromosomesTypes.ADJUSTING])
        adaptation_chromosome = self._build_adaptation_chromosome(chromosomes_set_json[ChromosomesTypes.ADAPTATION])
        building_chromosome = self._build_building_chromosome(chromosomes_set_json[ChromosomesTypes.BUILDING])
        combat_chromosome = self._build_combat_chromosome(chromosomes_set_json[ChromosomesTypes.COMBAT])

        return ChromosomesSet.build(body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)
    
    def _build_body_chromosome(self, chromosome_json: dict) -> BodyChromosome:
        strength_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['strength_gene'])
        defense_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['defense_gene'])
        max_hp_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['max_hp_gene'])
        hp_regen_rate_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['hp_regen_rate_gene'])
        sight_distance_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['sight_distance_gene'])
        speed_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['speed_gene'])
        return BodyChromosome.build(strength_gene, defense_gene, max_hp_gene, hp_regen_rate_gene, sight_distance_gene, speed_gene)

    def _build_development_chromosome(self, chromosome_json: dict) -> DevelopmentChromosome:
        queen_cast_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['queen_cast_gene'])
        worker_cast_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['worker_cast_gene'])
        warrior_cast_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['warrior_cast_gene']) if chromosome_json['warrior_cast_gene'] else None
        return DevelopmentChromosome.build(queen_cast_gene, worker_cast_gene, warrior_cast_gene)
    
    def _build_adjusting_chromosome(self, chromosome_json: dict) -> AdjustingChromosome:
        appetite_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['appetite_gene'])
        development_appetite_gene = self._json_genes_factory.build_gene_from_json(chromosome_json['development_appetite_gene'])
        return AdjustingChromosome.build(appetite_gene, development_appetite_gene)
    
    def _build_adaptation_chromosome(self, chromosome_json: dict) -> AdaptationChromosome:
        return AdaptationChromosome.build()
    
    def _build_building_chromosome(self, chromosome_json: dict) -> BuildingChromosome:
        return BuildingChromosome.build()
    
    def _build_combat_chromosome(self, chromosome_json: dict) -> CombatChromosome:
        return CombatChromosome.build()