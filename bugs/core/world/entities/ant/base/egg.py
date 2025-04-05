from .genetic.genome import Genome
from .ant_types import AntTypes
from .egg_states import EggStates
from core.world.entities.world.id_generator import IdGenerator

class Egg():

    @classmethod
    def build_new(cls, name: str, genome: Genome):
        id = IdGenerator.generate_id()
        ant_types = genome.get_avaliable_ant_types()
        return Egg.build(id, name, genome, 0, ant_types[0])
    
    @classmethod
    def build(cls, id: int, name: str, genome: Genome, progress: int, ant_type: AntTypes):
        return Egg(id, name, genome, progress, ant_type)

    def __init__(self, id: int, name: str, genome: Genome, progress: int, ant_type: AntTypes):
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
    
    @name.setter
    def name(self, value: str):
        self._name = value
    
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
    
    @ant_type.setter
    def ant_type(self, ant_type: AntTypes):
        self._ant_type = ant_type
    
    @property
    def is_ready(self):
        return self.state == EggStates.READY
    
    @property
    def is_spoiled(self):
        return self.state == EggStates.SPOILED

    @property
    def state(self) -> EggStates:
        if self._progress < 100:
            return EggStates.DEVELOPMENT
        elif self._progress >= 100 and self._progress < 300:
            return EggStates.READY
        else:
            return EggStates.SPOILED

    def develop(self):
        if self.state == EggStates.SPOILED:
            return False
        
        self._progress += 10
        return True