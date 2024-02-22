from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.ant.base.genetic.genes.base.domination_codes import DominationCodes
from core.world.entities.ant.base.genetic.genes.base_strength_gene import BaseStrengthGene
from core.world.entities.ant.base.genetic.genes.base_defense_gene import BaseDefenseGene
from core.world.entities.ant.base.genetic.genes.base_max_hp_gene import BaseMaxHpGene
from core.world.entities.ant.base.genetic.genes.base_hp_regen_rate_gene import BaseHpRegenRateGene
from core.world.entities.ant.base.genetic.genes.base_speed_gene import BaseSpeedGene
from core.world.entities.ant.base.genetic.genes.base_sight_distance_gene import BaseSightDistanceGene
from core.world.entities.ant.base.genetic.genes.development_queen_caste_gene import DevelopmentQueenCasteGene
from core.world.entities.ant.base.genetic.genes.development_worker_caste_gene import DevelopmentWorkerCasteGene
from core.world.entities.ant.base.genetic.genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene
from core.world.entities.ant.base.genetic.genes.adjusting_appetite_gene import AdjustingAppetiteGene
from core.world.entities.ant.base.genetic.genes.adjusting_development_appetite_gene import AdjustingDevelopmentAppetiteGene

class JsonGenesFactory():

    def build_gene_from_json(self, gene_json: dict) -> BaseGene:
        match gene_json['type']:
            case GenesTypes.BASE_STRENGTH:
                return self._build_base_strength_gene(gene_json)
            case GenesTypes.BASE_DEFENSE:
                return self._build_base_defense_gene(gene_json)
            case GenesTypes.BASE_MAX_HP:
                return self._build_base_max_hp_gene(gene_json)
            case GenesTypes.BASE_HP_REGEN_RATE:
                return self._build_base_hp_regen_rate_gene(gene_json)
            case GenesTypes.BASE_SPEED:
                return self._build_base_speed_gene(gene_json)
            case GenesTypes.BASE_SIGHT_DISTANCE:
                return self._build_base_sight_distance_gene(gene_json)
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
                return self._build_development_queen_caste_gene(gene_json)
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
                return self._build_development_worker_caste_gene(gene_json)
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                return self._build_development_warrior_caste_gene(gene_json)
            case GenesTypes.ADJUSTING_APPETITE:
                return self._build_adjusting_appetite_gene(gene_json)
            case GenesTypes.ADJUSTING_DEVELOPMENT_APPETITE:
                return self._build_adjusting_development_appetite_gene(gene_json)
            case _:
                raise Exception('unknown gene')
            
    def _build_base_strength_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        strength = gene_json['strength']
        return BaseStrengthGene.build(domination_code, strength)
    
    def _build_base_defense_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        defense = gene_json['defense']
        return BaseDefenseGene.build(domination_code, defense)
    
    def _build_base_max_hp_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        max_hp = gene_json['max_hp']
        return BaseMaxHpGene.build(domination_code, max_hp)
    
    def _build_base_hp_regen_rate_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        hp_regen_rate = gene_json['hp_regen_rate']
        return BaseHpRegenRateGene.build(domination_code, hp_regen_rate)
    
    def _build_base_speed_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        speed = gene_json['speed']
        return BaseSpeedGene.build(domination_code, speed)
    
    def _build_base_sight_distance_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        sight_distance = gene_json['sight_distance']
        return BaseSightDistanceGene.build(domination_code, sight_distance)
    
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
    
    def _build_adjusting_appetite_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        return AdjustingAppetiteGene.build(domination_code)
    
    def _build_adjusting_development_appetite_gene(self, gene_json: dict):
        domination_code = DominationCodes(gene_json['domination_code'])
        return AdjustingDevelopmentAppetiteGene.build(domination_code)
    