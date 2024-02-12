from .chromosomes_set import ChromosomesSet

class Genome():

    @classmethod
    def build(cls, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        return Genome(maternal_chromosomes_set, paternal_chromosomes_set)

    def __init__(self, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        self._maternal_chromosomes_set = maternal_chromosomes_set
        self._paternal_chromosomes_set = paternal_chromosomes_set

    @property
    def maternal_chromosomes_set(self) -> ChromosomesSet:
        return self._maternal_chromosomes_set
    
    @property
    def paternal_chromosomes_set(self) -> ChromosomesSet:
        return self._paternal_chromosomes_set