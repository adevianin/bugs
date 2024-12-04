from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.id_generator import IdGenerator

class SpecieGene():

    @classmethod
    def build_new(cls, gene: BaseGene):
        id = IdGenerator.generate_id()
        return SpecieGene(id, gene)
    
    @classmethod
    def build(cls, id: str, gene: BaseGene):
        return SpecieGene(id, gene)

    def __init__(self, id: str, gene: BaseGene):
        self._id = id
        self._gene = gene

    @property
    def id(self):
        return self._id

    @property
    def gene(self) -> BaseGene:
        return self._gene
    
    def generate_gene(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return self._gene.mutate(percent, super_mutate_chance, super_mutate_percent)
    