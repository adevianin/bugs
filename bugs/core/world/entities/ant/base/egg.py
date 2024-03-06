from .genetic.genome import Genome
from .ant_types import AntTypes
import uuid

class Egg():

    @classmethod
    def build_new(cls, name: str, genome: Genome):
        id = uuid.uuid4().hex
        ant_types = genome.get_avaliable_ant_types()
        return Egg.build(id, name, genome, 0, ant_types[0])
    
    @classmethod
    def build(cls, id: str, name: str, genome: Genome, progress: int, ant_type: AntTypes):
        return Egg(id, name, genome, progress, ant_type)

    def __init__(self, id: str, name: str, genome: Genome, progress: int, ant_type: AntTypes):
        self._id = id
        self._name = name
        self._genome = genome
        self._progress = progress
        self._ant_type = ant_type

    @property
    def id(self):
        return self._id

    @property
    def name(self):
        return self._name
    
    @property
    def genome(self):
        return self._genome
    
    @property
    def is_fertilized(self):
        return self._genome.paternal_chromosomes_set is not None
    
    @property
    def progress(self):
        return self._progress
    
    @property
    def ant_type(self):
        return self._ant_type
    
    @property
    def is_ready(self):
        return self._progress == 100
    
    def develop(self):
        if not self.is_ready:
            self._progress += 1