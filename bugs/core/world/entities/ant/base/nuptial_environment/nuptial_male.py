from core.world.entities.ant.base.genetic.chromosome.chromosomes_set import ChromosomesSet
import uuid

class NuptialMale():

    @classmethod
    def build(cls, chromosomes_set: ChromosomesSet):
        id = uuid.uuid4().hex
        return NuptialMale(id, chromosomes_set)

    def __init__(self, id: str, chromosomes_set: ChromosomesSet):
        self._id = id
        self._chromosomes_set = chromosomes_set

    @property
    def id(self):
        return self._id

    @property
    def chromosomes_set(self) -> ChromosomesSet:
        return self._chromosomes_set