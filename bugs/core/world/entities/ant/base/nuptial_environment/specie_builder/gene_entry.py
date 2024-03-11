from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene

class GeneEntry():

    @classmethod
    def build(cls, id: str, gene: BaseGene):
        return GeneEntry(id, gene)

    def __init__(self, id: str, gene: BaseGene):
        self.id = id
        self.gene = gene