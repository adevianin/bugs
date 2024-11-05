from core.world.utils.event_emiter import EventEmitter
from .player_stats import PlayerStats

class PlayerStatsFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_player_stats(self, owner_id: int, ants_count: int, colonies_count: int):
        return PlayerStats(self._event_bus, owner_id, ants_count, colonies_count)