from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.body_strength_gene import BodyStrengthGene
from core.world.entities.ant.base.genetic.genes.body_defense_gene import BodyDefenseGene
from core.world.entities.ant.base.genetic.genes.body_max_hp_gene import BodyMaxHpGene
from core.world.entities.ant.base.genetic.genes.body_hp_regen_rate_gene import BodyHpRegenRateGene
from core.world.entities.ant.base.genetic.genes.body_speed_gene import BodySpeedGene
from core.world.entities.ant.base.genetic.genes.body_sight_distance_gene import BodySightDistanceGene
from core.world.entities.ant.base.genetic.genes.body_life_span_gene import BodyLifeSpanGene
from core.world.entities.ant.base.genetic.genes.development_caste_gene import DevelopmentCasteGene
from core.world.entities.ant.base.genetic.genes.development_queen_caste_gene import DevelopmentQueenCasteGene
from core.world.entities.ant.base.genetic.genes.development_worker_caste_gene import DevelopmentWorkerCasteGene
from core.world.entities.ant.base.genetic.genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene
from core.world.entities.ant.base.genetic.genes.development_male_caste_gene import DevelopmentMaleCasteGene
from core.world.entities.ant.base.genetic.genes.adjusting_appetite_gene import AdjustingAppetiteGene
from core.world.entities.ant.base.genetic.genes.adjusting_development_appetite_gene import AdjustingDevelopmentAppetiteGene
from core.world.entities.ant.base.genetic.genes.adaptation_cold_gene import AdaptationColdGene
from core.world.entities.ant.base.genetic.genes.building_subnest_gene import BuildingSubnestGene

class GenesSerializer():

    def serialize(self, gene: BaseGene):
        match gene.type:
            case GenesTypes.BODY_STRENGTH:
                return self._serialize_body_strength_gene(gene)
            case GenesTypes.BODY_DEFENSE:
                return self._serialize_body_defense_gene(gene)
            case GenesTypes.BODY_MAX_HP:
                return self._serialize_body_max_hp_gene(gene)
            case GenesTypes.BODY_HP_REGEN_RATE:
                return self._serialize_body_hp_regen_rate_gene(gene)
            case GenesTypes.BODY_SPEED:
                return self._serialize_body_speed_gene(gene)
            case GenesTypes.BODY_SIGHT_DISTANCE:
                return self._serialize_body_sight_distance_gene(gene)
            case GenesTypes.BODY_LIFE_SPAN:
                return self._serialize_body_life_span_gene(gene)
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
                return self._serialize_development_queen_caste_gene(gene)
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
                return self._serialize_development_worker_caste_gene(gene)
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                return self._serialize_development_warrior_caste_gene(gene)
            case GenesTypes.DEVELOPMENT_MALE_CASTE:
                return self._serialize_development_male_caste_gene(gene)
            case GenesTypes.ADJUSTING_APPETITE:
                return self._serialize_adjusting_appetite_gene(gene)
            case GenesTypes.ADJUSTING_DEVELOPMENT_APPETITE:
                return self._serialize_adjusting_development_appetite_gene(gene)
            case GenesTypes.ADAPTATION_COLD:
                return self._serialize_adaptation_cold_gene(gene)
            case GenesTypes.BUILDING_SUBNEST:
                return self._serialize_building_subnest_gene(gene)
            case _:
                raise Exception('unknown gene type')
            
    def _serialize_base_gene(self, gene: BaseGene):
        return {
            'type': gene.type,
            'domination_code': gene.domination_code
        }
            
    def _serialize_body_strength_gene(self, gene: BodyStrengthGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'strength': gene.strength
        })
        return json
    
    def _serialize_body_defense_gene(self, gene: BodyDefenseGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'defense': gene.defense
        })
        return json
    
    def _serialize_body_max_hp_gene(self, gene: BodyMaxHpGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'max_hp': gene.max_hp
        })
        return json
    
    def _serialize_body_hp_regen_rate_gene(self, gene: BodyHpRegenRateGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'hp_regen_rate': gene.hp_regen_rate
        })
        return json
    
    def _serialize_body_speed_gene(self, gene: BodySpeedGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'speed': gene.speed
        })
        return json
    
    def _serialize_body_life_span_gene(self, gene: BodyLifeSpanGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'life_span': gene.life_span
        })
        return json
    
    def _serialize_body_sight_distance_gene(self, gene: BodySightDistanceGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'sight_distance': gene.sight_distance
        })
        return json
    
    def _serialize_base_development_caste_gene(self, gene: DevelopmentCasteGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'strength': gene.strength,
            'defense': gene.defense,
            'max_hp': gene.max_hp,
            'hp_regen_rate': gene.hp_regen_rate,
            'speed': gene.speed
        })
        return json
    
    def _serialize_development_queen_caste_gene(self, gene: DevelopmentQueenCasteGene):
        return self._serialize_base_development_caste_gene(gene)
    
    def _serialize_development_worker_caste_gene(self, gene: DevelopmentWorkerCasteGene):
        return self._serialize_base_development_caste_gene(gene)
    
    def _serialize_development_warrior_caste_gene(self, gene: DevelopmentWarriorCasteGene):
        return self._serialize_base_development_caste_gene(gene)
    
    def _serialize_development_male_caste_gene(self, gene: DevelopmentMaleCasteGene):
        return self._serialize_base_development_caste_gene(gene)
    
    def _serialize_adjusting_appetite_gene(self, gene: AdjustingAppetiteGene):
        json = self._serialize_base_gene(gene)
        return json
    
    def _serialize_adjusting_development_appetite_gene(self, gene: AdjustingDevelopmentAppetiteGene):
        json = self._serialize_base_gene(gene)
        return json
    
    def _serialize_adaptation_cold_gene(self, gene: AdaptationColdGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'resistance_points': gene.resistance_points
        })
        return json
    
    def _serialize_building_subnest_gene(self, gene: BuildingSubnestGene):
        return self._serialize_base_gene(gene)
    