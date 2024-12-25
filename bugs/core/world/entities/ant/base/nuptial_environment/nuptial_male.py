from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.ant_stats import AntStats
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.world.id_generator import IdGenerator

class NuptialMale():

    @classmethod
    def build_new(cls, genome: Genome):
        id = IdGenerator.generate_id()
        return NuptialMale(id, genome)

    def __init__(self, id: int, genome: Genome):
        self._id = id
        self._genome = genome
        self._stats = AntStats.build(AntTypes.MALE, genome)

    @property
    def id(self):
        return self._id

    @property
    def genome(self) -> Genome:
        return self._genome
    
    @property
    def stats(self) -> AntStats:
        return self._stats