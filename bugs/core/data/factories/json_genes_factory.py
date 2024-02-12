from core.world.entities.ant.base.genome.genes.base_gene import BaseGene
from core.world.entities.ant.base.genome.genes.genes_types import GenesTypes
from core.world.entities.ant.base.genome.genes.base_chromosome.strength_gene import StrengthGene

class JsonGenesFactory():

    def build_gene_from_json(self, gene_json: dict) -> BaseGene:
        match gene_json['type']:
            case GenesTypes.STRENGTH:
                return StrengthGene.build(gene_json['domination_lvl'], gene_json['strength'])
            case _:
                raise Exception('unknown gene')
