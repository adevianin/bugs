from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from abc import abstractmethod, ABC
from typing import List

class iNuptialEnvironmentClientSerializer(ABC):

    @abstractmethod
    def serialize_nuptial_male(self, nuptial_male: NuptialMale) -> dict:
        pass

    @abstractmethod
    def serialize_nuptial_males(self, nuptial_males: NuptialMale) -> List[dict]:
        pass

    @abstractmethod
    def serialize_specie(self, specie: Specie) -> dict:
        pass