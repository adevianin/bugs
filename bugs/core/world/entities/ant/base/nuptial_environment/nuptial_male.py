from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.ant_stats import AntStats
from core.world.entities.ant.base.ant_types import AntTypes
import uuid

class NuptialMale():

    @classmethod
    def build(cls, genome: Genome, is_local: bool):
        id = uuid.uuid4().hex
        return NuptialMale(id, genome, is_local)

    def __init__(self, id: str, genome: Genome, is_local: bool):
        self._id = id
        self._genome = genome
        self._is_local = is_local
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
    
    @property
    def is_local(self) -> bool:
        return self._is_local