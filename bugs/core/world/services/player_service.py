from core.world.entities.world.world import World
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.ant.ant_factory import AntFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory
from core.world.entities.world.player_stats_factory import PlayerStatsFactory

from typing import Callable

class PlayerService():

    def __init__(self, event_bus: EventEmitter, colony_factory: ColonyFactory, ant_factory: AntFactory, nuptial_env_factory: NuptialEnvironmentFactory, 
                 player_stats_factory: PlayerStatsFactory):
        self._event_bus = event_bus
        self._colony_factory = colony_factory
        self._ant_factory = ant_factory
        self._nuptial_env_factory = nuptial_env_factory
        self._player_stats_factory = player_stats_factory

    def set_world(self, world: World):
        self._world = world

    def build_player_starter_pack(self, player_id: int):
        specie = Specie.build_new()
        nuptial_env = self._nuptial_env_factory.build_nuptial_environment(player_id, specie, [])
        player_stats = self._player_stats_factory.build_player_stats(player_id, 0, 0)
        self._world.add_new_nuptial_environment(nuptial_env)
        self._world.add_new_player_stats(player_stats)

    def born_new_antara(self, player_id: int):
        player_ant_colonies = self._world.get_ant_colonies_by_owner(player_id)

        if len(player_ant_colonies) > 0:
            return
        
        owner_filter: Callable[[Ant], bool] = lambda ant: ant.owner_id == player_id
        player_ants = self._world.map.get_entities(entity_types=[EntityTypes.ANT], filter=owner_filter)

        if len(player_ants) > 0:
            return
        
        def on_antara_born(queen: QueenAnt):
            queen.fly_nuptial_flight()

        nuptial_env = self._world.get_nuptial_environment_by_owner(player_id)
        nuptial_env.born_antara(on_antara_born)
    