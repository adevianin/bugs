from .nuptial_male import NuptialMale
from core.world.entities.ant.male.male_ant import MaleAnt
from .specie_builder.specie import Specie
from core.world.entities.world.player_stats import PlayerStats
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.damage_types import DamageTypes
from core.world.entities.ant.base.ant import Ant
from .nuptial_environment_weights_pack import NuptialEnvironmentWeightsPack
from typing import List

class NuptialEnvironment():

    def __init__(self, event_bus: EventEmitter, owner_id: int, specie: Specie, player_stats: PlayerStats, weights_pack: NuptialEnvironmentWeightsPack):
        self._event_bus = event_bus
        self._specie = specie
        self._player_stats = player_stats
        self._owner_id = owner_id
        self._males: List[NuptialMale] = []
        self._weights_pack = weights_pack

        self._event_bus.add_listener('ant_received_damage_stat', self._on_ant_received_damaged)
        self._event_bus.add_listener('ant_damaged_another_body_stat', self._on_ant_damaged_another_body)
        self._event_bus.add_listener('ant_gave_fortification_item_stat', self._on_ant_gave_fortification_item)
        self._event_bus.add_listener('ant_built_nest_stat', self._on_ant_built_nest)

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def specie(self) -> Specie:
        return self._specie
    
    @property
    def weights_pack(self) -> NuptialEnvironmentWeightsPack:
        return self._weights_pack
    
    @property
    def _action_weight(self):
        return 1/self._player_stats.ants_count
    
    def fly_in_male(self, male: MaleAnt):
        self._specie.accept_male_genome(male.body.genome)
    
    def get_male(self, male_id: str) -> NuptialMale:
        for male in self._males:
            if male.id == male_id:
                self._males.remove(male)
                return male
        
        return None
    
    def search_males(self) -> List[NuptialMale]:
        if len(self._males) == 0:
            self._generate_males()

        return self._males
    
    def _generate_males(self, count = 3):
        self._males = []
        for i in range(count):
            male = self._generate_nuptial_male()
            self._males.append(male)
    
    def _generate_nuptial_male(self) -> NuptialMale:
        genome = self._specie.generate_male_genome(20, 1, 60)
        return NuptialMale.build(genome)
    
    def _on_ant_received_damaged(self, damage_type: DamageTypes, ant: Ant):
        if ant.owner_id == self.owner_id:
            match(damage_type):
                case DamageTypes.COMBAT:
                    self._weights_pack.combat_damage_received_weight += self._action_weight
                case DamageTypes.COLD:
                    self._weights_pack.cold_damage_received_weight += self._action_weight

    def _on_ant_damaged_another_body(self, ant: Ant):
        if ant.owner_id == self.owner_id:
            self._weights_pack.combat_damage_done_weight += self._action_weight

    def _on_ant_gave_fortification_item(self, ant: Ant):
        if ant.owner_id == self.owner_id:
            self._weights_pack.building_weight += self._action_weight

    def _on_ant_built_nest(self, ant: Ant):
        if ant.owner_id == self.owner_id:
            self._weights_pack.building_weight += self._action_weight