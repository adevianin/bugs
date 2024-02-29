from core.world.entities.ant.base.genetic.genome import Genome
import uuid

class NuptialMale():

    @classmethod
    def build(cls, genome: Genome):
        id = uuid.uuid4().hex
        return NuptialMale(id, genome)

    def __init__(self, id: str, genome: Genome):
        self._id = id
        self._genome = genome

    @property
    def id(self):
        return self._id

    @property
    def genome(self) -> Genome:
        return self._genome