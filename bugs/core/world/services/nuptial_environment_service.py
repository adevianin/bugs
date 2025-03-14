from .base_service import BaseService
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

from typing import List, Dict

class NuptialEnvironmentService(BaseService):

    def get_specie_for(self, user_id: int) -> Specie:
        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)

        return nuptial_environment.specie
    
    def get_nuptial_males_for_owner(self, user_id: int):
        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)
        return nuptial_environment.males
    
    def change_specie_schema(self, user_id: int, specie_schema: Dict[ChromosomeTypes, List[str]]):
        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)
        if nuptial_environment.specie.validate_schema(specie_schema):
            nuptial_environment.specie.apply_schema(specie_schema)
            return None
        else:
            return 'SPECIE_SCHEMA_IS_NOT_VALID'
        