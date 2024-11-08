from core.world.utils.event_emiter import EventEmitter
from .nuptial_environment import NuptialEnvironment
from .specie_builder.specie import Specie
from .specie_activity_weights_pack import SpecieActivityWeightsPack
from .nuptial_male import NuptialMale

from typing import List

class NuptialEnvironmentFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_nuptial_environment(self, owner_id: int, specie: Specie, males: List[NuptialMale], attack_weight: int = 0, defense_weight: int = 0, cold_resistance_weight: int = 0, building_weight: int = 0):
        specie_activity = SpecieActivityWeightsPack(attack_weight, defense_weight, cold_resistance_weight, building_weight)
        return NuptialEnvironment(self._event_bus, owner_id, specie, specie_activity, males)