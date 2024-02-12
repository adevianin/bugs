from core.world.entities.ant.base.genome.genes.genes_types import GenesTypes
from core.world.entities.ant.base.genome.genes.base_gene import BaseGene
from core.world.entities.ant.base.genome.genes.base_chromosome.strength_gene import StrengthGene

class GenesSerializer():

    def serialize(self, gene: BaseGene):
        match gene.type:
            case GenesTypes.STRENGTH:
                return self._serialize_strength_gene(gene)
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