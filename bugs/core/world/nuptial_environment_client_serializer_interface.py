from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_builder import SpecieBuilder
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
    def serialize_specie_builder(self, specie_builder: SpecieBuilder) -> dict:
        pass