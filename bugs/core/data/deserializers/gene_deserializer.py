from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.ant.base.genetic.genes.base.domination_codes import DominationCodes
from core.world.entities.ant.base.genetic.genes.body_strength_gene import BodyStrengthGene
from core.world.entities.ant.base.genetic.genes.body_defense_gene import BodyDefenseGene
from core.world.entities.ant.base.genetic.genes.body_max_hp_gene import BodyMaxHpGene
from core.world.entities.ant.base.genetic.genes.body_hp_regen_rate_gene import BodyHpRegenRateGene
from core.world.entities.ant.base.genetic.genes.body_speed_gene import BodySpeedGene
from core.world.entities.ant.base.genetic.genes.body_sight_distance_gene import BodySightDistanceGene
from core.world.entities.ant.base.genetic.genes.development_queen_caste_gene import DevelopmentQueenCasteGene
from core.world.entities.ant.base.genetic.genes.development_worker_caste_gene import DevelopmentWorkerCasteGene
from core.world.entities.ant.base.genetic.genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene
from core.world.entities.ant.base.genetic.genes.development_male_caste_gene import DevelopmentMaleCasteGene
from core.world.entities.ant.base.genetic.genes.adjusting_appetite_gene import AdjustingAppetiteGene
from core.world.entities.ant.base.genetic.genes.adjusting_development_appetite_gene import AdjustingDevelopmentAppetiteGene
from core.world.entities.ant.base.genetic.genes.adaptation_cold_gene import AdaptationColdGene

class GeneDeserializer():

    def deserialize_gene(self, gene_json: dict) -> BaseGene:
        match gene_json['type']:
            case GenesTypes.BODY_STRENGTH:
                return self._build_body_strength_gene(gene_json)
            case GenesTypes.BODY_DEFENSE:
                return self._build_body_defense_gene(gene_json)
            case GenesTypes.BODY_MAX_HP:
                return self._build_body_max_hp_gene(gene_json)
            case GenesTypes.BODY_HP_REGEN_RATE:
                return self._build_body_hp_regen_rate_gene(gene_json)
            case GenesTypes.BODY_SPEED:
                return self._build_body_speed_gene(gene_json)
            case GenesTypes.BODY_SIGHT_DISTANCE:
                return self._build_body_sight_distance_gene(gene_json)
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
                return self._build_development_queen_caste_gene(gene_json)
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
                return self._build_development_worker_caste_gene(gene_json)
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                return self._build_development_warrior_caste_gene(gene_json)
            case GenesTypes.DEVELOPMENT_MALE_CASTE:
                return self._build_development_male_caste_gene(gene_json)
            case GenesTypes.ADJUSTING_APPETITE:
                return self._build_adjusting_appetite_gene(gene_json)
            case GenesTypes.ADJUSTING_DEVELOPMENT_APPETITE:
                return self._build_adjusting_development_appetite_gene(gene_json)
            case GenesTypes.ADAPTATION_COLD:
                return self._build_adaptation_cold_gene(gene_json)
            case _:
                raise Exception('unknown gene')
            
    def _build_body_strength_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        strength = gene_json['strength']
        return BodyStrengthGene.build(domination_code, strength)
    
    def _build_body_defense_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        defense = gene_json['defense']
        return BodyDefenseGene.build(domination_code, defense)
    
    def _build_body_max_hp_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        max_hp = gene_json['max_hp']
        return BodyMaxHpGene.build(domination_code, max_hp)
    
    def _build_body_hp_regen_rate_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        hp_regen_rate = gene_json['hp_regen_rate']
        return BodyHpRegenRateGene.build(domination_code, hp_regen_rate)
    
    def _build_body_speed_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        speed = gene_json['speed']
        return BodySpeedGene.build(domination_code, speed)
    
    def _build_body_sight_distance_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        sight_distance = gene_json['sight_distance']
        return BodySightDistanceGene.build(domination_code, sight_distance)
    
    def _build_development_queen_caste_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        strength = gene_json['strength']
        defense = gene_json['defense']
        max_hp = gene_json['max_hp']
        hp_regen_rate = gene_json['hp_regen_rate']
        speed = gene_json['speed']
        return DevelopmentQueenCasteGene.build(domination_code, strength, defense, max_hp, hp_regen_rate, speed)
    
    def _build_development_worker_caste_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        strength = gene_json['strength']
        defense = gene_json['defense']
        max_hp = gene_json['max_hp']
        hp_regen_rate = gene_json['hp_regen_rate']
        speed = gene_json['speed']
        return DevelopmentWorkerCasteGene.build(domination_code, strength, defense, max_hp, hp_regen_rate, speed)
    
    def _build_development_warrior_caste_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        strength = gene_json['strength']
        defense = gene_json['defense']
        max_hp = gene_json['max_hp']
        hp_regen_rate = gene_json['hp_regen_rate']
        speed = gene_json['speed']
        return DevelopmentWarriorCasteGene.build(domination_code, strength, defense, max_hp, hp_regen_rate, speed)
    
    def _build_development_male_caste_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        strength = gene_json['strength']
        defense = gene_json['defense']
        max_hp = gene_json['max_hp']
        hp_regen_rate = gene_json['hp_regen_rate']
        speed = gene_json['speed']
        return DevelopmentMaleCasteGene.build(domination_code, strength, defense, max_hp, hp_regen_rate, speed)
    
    def _build_adjusting_appetite_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        return AdjustingAppetiteGene.build(domination_code)
    
    def _build_adjusting_development_appetite_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        return AdjustingDevelopmentAppetiteGene.build(domination_code)
    
    def _build_adaptation_cold_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        resistance_points = gene_json['resistance_points']
        return AdaptationColdGene.build(domination_code, resistance_points)
    