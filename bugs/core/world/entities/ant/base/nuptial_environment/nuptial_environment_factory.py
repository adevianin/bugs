from core.world.utils.event_emiter import EventEmitter
from .nuptial_environment import NuptialEnvironment
from .specie_builder.specie import Specie
from core.world.entities.world.player_stats import PlayerStats
from .specie_activity_weights_pack import SpecieActivityWeightsPack

class NuptialEnvironmentFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_nuptial_environment(self, owner_id: int, specie: Specie, player_stats: PlayerStats, attack_weight: int = 0, 
                                  defense_weight: int = 0, cold_resistance_weight: int = 0, building_weight: int = 0):
        specie_activity = SpecieActivityWeightsPack(attack_weight, defense_weight, cold_resistance_weight, building_weight)
        return NuptialEnvironment(self._event_bus, owner_id, specie, player_stats, specie_activity)