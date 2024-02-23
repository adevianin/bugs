from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
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

class GenesClientSerializer():

    def serialize(self, gene: BaseGene):
        match gene.type:
            case GenesTypes.BASE_STRENGTH:
                return self._serialize_base_strength_gene(gene)
            case GenesTypes.BASE_DEFENSE:
                return self._serialize_base_defense_gene(gene)
            case GenesTypes.BASE_MAX_HP:
                return self._serialize_base_max_hp_gene(gene)
            case GenesTypes.BASE_HP_REGEN_RATE:
                return self._serialize_base_hp_regen_rate_gene(gene)
            case GenesTypes.BASE_SPEED:
                return self._serialize_base_speed_gene(gene)
            case GenesTypes.BASE_SIGHT_DISTANCE:
                return self._serialize_base_sight_distance_gene(gene)
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
                return self._serialize_development_queen_caste_gene(gene)
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
                return self._serialize_development_worker_caste_gene(gene)
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                return self._serialize_development_warrior_caste_gene(gene)
            case GenesTypes.ADJUSTING_APPETITE:
                return self._serialize_adjusting_appetite_gene(gene)
            case GenesTypes.ADJUSTING_DEVELOPMENT_APPETITE:
                return self._serialize_adjusting_development_appetite_gene(gene)
            case _:
                raise Exception('unknown gene type')
            
    def _serialize_base_gene(self, gene: BaseGene):
        return {
            'type': gene.type,
            'domination_code': gene.domination_code
        }
            
    def _serialize_base_strength_gene(self, gene: BaseStrengthGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'strength': gene.strength
        })
        return json
    
    def _serialize_base_defense_gene(self, gene: BaseDefenseGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'defense': gene.defense
        })
        return json
    
    def _serialize_base_max_hp_gene(self, gene: BaseMaxHpGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'max_hp': gene.max_hp
        })
        return json
    
    def _serialize_base_hp_regen_rate_gene(self, gene: BaseHpRegenRateGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'hp_regen_rate': gene.hp_regen_rate
        })
        return json
    
    def _serialize_base_speed_gene(self, gene: BaseSpeedGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'speed': gene.speed
        })
        return json
    
    def _serialize_base_sight_distance_gene(self, gene: BaseSightDistanceGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'sight_distance': gene.sight_distance
        })
        return json
    
    def _serialize_development_queen_caste_gene(self, gene: DevelopmentQueenCasteGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'strength': gene.strength,
            'defense': gene.defense,
            'max_hp': gene.max_hp,
            'hp_regen_rate': gene.hp_regen_rate,
            'speed': gene.speed
        })
        return json
    
    def _serialize_development_worker_caste_gene(self, gene: DevelopmentWorkerCasteGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'strength': gene.strength,
            'defense': gene.defense,
            'max_hp': gene.max_hp,
            'hp_regen_rate': gene.hp_regen_rate,
            'speed': gene.speed
        })
        return json
    
    def _serialize_development_warrior_caste_gene(self, gene: DevelopmentWarriorCasteGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'strength': gene.strength,
            'defense': gene.defense,
            'max_hp': gene.max_hp,
            'hp_regen_rate': gene.hp_regen_rate,
            'speed': gene.speed
        })
        return json
    
    def _serialize_adjusting_appetite_gene(self, gene: AdjustingAppetiteGene):
        json = self._serialize_base_gene(gene)
        return json
    
    def _serialize_adjusting_development_appetite_gene(self, gene: AdjustingDevelopmentAppetiteGene):
        json = self._serialize_base_gene(gene)
        return json
    