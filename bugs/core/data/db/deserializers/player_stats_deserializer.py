from typing import Dict
from core.world.entities.world.player_stats_factory import PlayerStatsFactory

class PlayerStatsDeserializer():

    def __init__(self, player_stats_factory: PlayerStatsFactory):
        self._player_stats_factory = player_stats_factory

    def deserialize(self, player_stats_json: Dict):
        owner_id = player_stats_json['owner_id']
        ants_count = player_stats_json['ants_count']
        colonies_count = player_stats_json['colonies_count']
        return self._player_stats_factory.build_player_stats(owner_id, ants_count, colonies_count)
