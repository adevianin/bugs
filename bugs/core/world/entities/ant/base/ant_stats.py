from core.world.entities.base.stats_types import StatsTypes
from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.ant_types import AntTypes

class AntStats(LiveStats):

    @classmethod
    def build(cls, ant_type: AntTypes, genome: Genome):
        phenotype = genome.generate_phenotype(ant_type)
        max_hp = round(phenotype.max_hp)
        hp_regen_rate = round(phenotype.hp_regen_rate)
        speed = round(phenotype.speed)
        sight_distance = round(phenotype.sight_distance)
        strength = round(phenotype.strength)
        defense = round(phenotype.defense)
        appetite = round(phenotype.appetite)
        min_temperature = round(phenotype.min_temperature)
        life_span = round(phenotype.life_span)
        return AntStats(StatsTypes.ANT, max_hp, hp_regen_rate, speed, sight_distance, strength, defense, appetite, min_temperature, life_span)
    