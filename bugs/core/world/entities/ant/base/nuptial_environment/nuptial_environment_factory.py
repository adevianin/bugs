from core.world.utils.event_emiter import EventEmitter
from .nuptial_environment import NuptialEnvironment
from .specie_builder.specie import Specie
from core.world.entities.world.player_stats import PlayerStats

class NuptialEnvironmentFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_nuptial_environment(self, owner_id: int, specie: Specie, player_stats: PlayerStats):
        return NuptialEnvironment(self._event_bus, owner_id, specie, player_stats)