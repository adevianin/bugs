from .base_service import BaseService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory

class PlayerService(BaseService):

    def __init__(self, event_bus: EventEmitter, nuptial_env_factory: NuptialEnvironmentFactory):
        super().__init__(event_bus)
        self._nuptial_env_factory = nuptial_env_factory

    def ensure_starter_pack_built_for_player(self, player_id: int):
        is_built = self._check_starter_pack_for_player(player_id)
        if not is_built:
            self._build_starter_pack_for_player(player_id)

    def _build_starter_pack_for_player(self, player_id: int):
        specie = Specie.build_new()
        nuptial_env = self._nuptial_env_factory.build_nuptial_environment(player_id, specie, [])
        self._world.add_new_nuptial_environment(nuptial_env)

    def _check_starter_pack_for_player(self, player_id: int) -> bool:
        for environment in self._world.nuptial_environments:
            if environment.owner_id == player_id:
                return True
            
        return False
    