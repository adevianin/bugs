from core.world.entities.base.stats_types import StatsTypes
from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.ant_types import AntTypes

class AntStats(LiveStats):

    NDIGITS = 0

    @classmethod
    def build(cls, ant_type: AntTypes, genome: Genome):
        phenotype = genome.generate_phenotype(ant_type)
        max_hp = round(phenotype.max_hp, AntStats.NDIGITS)
        hp_regen_rate = round(phenotype.hp_regen_rate, AntStats.NDIGITS)
        speed = round(phenotype.speed, AntStats.NDIGITS)
        sight_distance = round(phenotype.sight_distance, AntStats.NDIGITS)
        strength = round(phenotype.strength, AntStats.NDIGITS)
        defense = round(phenotype.defense, AntStats.NDIGITS)
        appetite = round(phenotype.appetite, AntStats.NDIGITS)
        min_temperature = round(phenotype.min_temperature, AntStats.NDIGITS)
        return AntStats(StatsTypes.ANT, max_hp, hp_regen_rate, speed, sight_distance, strength, defense, appetite, min_temperature)
    