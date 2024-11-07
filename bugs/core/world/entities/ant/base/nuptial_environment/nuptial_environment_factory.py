from core.world.utils.event_emiter import EventEmitter
from .nuptial_environment import NuptialEnvironment
from .specie_builder.specie import Specie
from core.world.entities.world.player_stats import PlayerStats
from .nuptial_environment_weights_pack import NuptialEnvironmentWeightsPack

class NuptialEnvironmentFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_nuptial_environment(self, owner_id: int, specie: Specie, player_stats: PlayerStats, combat_damage_done_weight: int = 0, 
                                  combat_damage_received_weight: int = 0, cold_damage_received_weight: int = 0, building_weight: int = 0):
        weights_pack = NuptialEnvironmentWeightsPack(combat_damage_done_weight, combat_damage_received_weight, cold_damage_received_weight, building_weight)
        return NuptialEnvironment(self._event_bus, owner_id, specie, player_stats, weights_pack)