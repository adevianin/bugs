from .base_service import BaseService
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.entity_types import EntityTypes
from core.world.exceptions import GameRuleError
from core.world.entities.ant.queen.queen_ant import QueenAnt

from typing import List, Dict, Callable

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
        
    def born_new_antara(self, player_id: int):
        owner_filter: Callable[[Ant], bool] = lambda ant: ant.owner_id == player_id
        player_ants = self._world.map.get_entities(entity_types=[EntityTypes.ANT], filter=owner_filter)

        if len(player_ants) > 0:
            raise GameRuleError('cant born antara with another ants')
        
        def on_antara_born(queen: QueenAnt):
            queen.fly_nuptial_flight()

        nuptial_env = self._find_nuptial_environment_for_owner(player_id)
        position = self._world.map.generate_random_point()
        nuptial_env.born_antara(position, on_antara_born)
        