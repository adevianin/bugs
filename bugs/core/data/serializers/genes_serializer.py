from core.world.entities.ant.base.genetic.genes.genes_types import GenesTypes
from core.world.entities.ant.base.genetic.genes.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.base_chromosome.strength_gene import StrengthGene
from core.world.entities.ant.base.genetic.genes.development_chromosome.strength_development_gene import StrengthDevelopmentGene

class GenesSerializer():

    def serialize(self, gene: BaseGene):
        match gene.type:
            case GenesTypes.STRENGTH:
                return self._serialize_strength_gene(gene)
            case GenesTypes.STRENGTH_DEVELOPMENT:
                return self._serialize_strength_development_gene(gene)
            case _:
                raise Exception('unknown gene type')
            
    def _serialize_base_gene(self, gene: BaseGene):
        return {
            'type': gene.type,
            'domination_lvl': gene.domination_lvl
        }
            
    def _serialize_strength_gene(self, gene: StrengthGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'strength': gene.strength
        })
        return json
    
    def _serialize_strength_development_gene(self, gene: StrengthDevelopmentGene):
        json = self._serialize_base_gene(gene)
        json.update({
            'multiplier': gene.multiplier,
            'ant_type': gene.ant_type
        })
        return json