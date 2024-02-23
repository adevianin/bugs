from core.world.entities.base.stats_types import StatsTypes
from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.ant_types import AntTypes

class AntStats(LiveStats):

    @classmethod
    def build(cls, ant_type: AntTypes, genome: Genome):
        phenotype = genome.generate_phenotype(ant_type)
        return AntStats(StatsTypes.ANT, phenotype.max_hp, phenotype.hp_regen_rate, phenotype.speed, phenotype.sight_distance, phenotype.strength, phenotype.defense, phenotype.appetite)
    
    def __init__(self, type: StatsTypes, max_hp: int, hp_regen_rate: int, distance_per_step: int, sight_distance: int, attack: int, defence: int, appetite: int):
        super().__init__(type, max_hp, hp_regen_rate, distance_per_step, sight_distance, attack, defence)
        self.appetite = appetite
