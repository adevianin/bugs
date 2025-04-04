from .base_service import BaseService
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.entity_types import EntityTypes
from core.world.exceptions import GameRuleError
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory
from core.world.entities.world.season_types import SeasonTypes
from core.world.settings import NUPTIAL_FLIGHT_SEASONS
from core.world.entities.ant.base.ant_types import AntTypes

from typing import List, Dict, Callable

class NuptialService(BaseService):

    def __init__(self, event_bus: EventEmitter, nuptial_env_factory: NuptialEnvironmentFactory):
        super().__init__(event_bus)
        self._nuptial_env_factory = nuptial_env_factory

        self._event_bus.add_listener('season_changed', self._on_season_changed)

    def ensure_nuptial_env_built_for_player(self, player_id: int):
        is_built = self._check_nuptial_env_for_player(player_id)
        if not is_built:
            self._build_nuptial_env_for_player(player_id)

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
            queen.fly_nuptial_flight(True)

        nuptial_env = self._find_nuptial_environment_for_owner(player_id)
        position = self._world.map.generate_random_point()
        nuptial_env.born_antara(position, on_antara_born)

    def _build_nuptial_env_for_player(self, player_id: int):
        specie = Specie.build_new()
        nuptial_env = self._nuptial_env_factory.build_nuptial_environment(player_id, specie, [])
        self._world.add_new_nuptial_environment(nuptial_env)
        if self._world.current_season in NUPTIAL_FLIGHT_SEASONS:
            nuptial_env.start_nuptial_season()

    def _check_nuptial_env_for_player(self, player_id: int) -> bool:
        for environment in self._world.nuptial_environments:
            if environment.owner_id == player_id:
                return True
            
        return False
    
    def _on_season_changed(self, season: SeasonTypes):
        if self._world.current_season == SeasonTypes.WINTER:
            self._kill_queens_in_nuptial_flight()
            self._stop_nuptial_season_for_envs()
        
        if self._world.current_season in NUPTIAL_FLIGHT_SEASONS:
            self._start_nuptial_season_for_envs()

    def _stop_nuptial_season_for_envs(self):
        for environment in self._world.nuptial_environments:
            environment.stop_nuptial_season()

    def _start_nuptial_season_for_envs(self):
        for environment in self._world.nuptial_environments:
            environment.start_nuptial_season()

    def _kill_queens_in_nuptial_flight(self):
        queens_in_flight_filter: Callable[[Ant], bool] = lambda ant: ant.ant_type == AntTypes.QUEEN and ant.is_in_nuptial_flight
        queens_in_flight: List[QueenAnt] = self._world.map.get_entities(entity_types=[EntityTypes.ANT], filter=queens_in_flight_filter)
        for queen in queens_in_flight:
            queen.position = self._world.map.generate_random_point()
            queen.cold_die()
        