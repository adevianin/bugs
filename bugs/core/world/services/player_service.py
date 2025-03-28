from .base_service import BaseService
from core.world.entities.world.world import World
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.ant.ant_factory import AntFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory
from core.world.entities.world.player_stats_factory import PlayerStatsFactory
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony

from typing import Callable

class PlayerService(BaseService):

    def __init__(self, event_bus: EventEmitter, nuptial_env_factory: NuptialEnvironmentFactory, player_stats_factory: PlayerStatsFactory):
        super().__init__(event_bus)
        self._nuptial_env_factory = nuptial_env_factory
        self._player_stats_factory = player_stats_factory

    def ensure_starter_pack_built_for_player(self, player_id: int):
        is_built = self._check_starter_pack_for_player(player_id)
        if not is_built:
            self._build_starter_pack_for_player(player_id)

    def _build_starter_pack_for_player(self, player_id: int):
        specie = Specie.build_new()
        nuptial_env = self._nuptial_env_factory.build_nuptial_environment(player_id, specie, [])
        player_stats = self._player_stats_factory.build_player_stats(player_id, 0, 0)
        self._world.add_new_nuptial_environment(nuptial_env)
        self._world.add_new_player_stats(player_stats)

    def _check_starter_pack_for_player(self, player_id: int) -> bool:
        for environment in self._world.nuptial_environments:
            if environment.owner_id == player_id:
                return True
            
        return False
    
    def _get_ant_colonies_by_owner(self, owner_id: int):
        owner_filter: Callable[[AntColony], bool] = lambda colony: colony.owner_id == owner_id
        return list(filter(owner_filter, self._world.ant_colonies))
    