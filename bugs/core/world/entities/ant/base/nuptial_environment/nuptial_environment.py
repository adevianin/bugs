from .nuptial_male import NuptialMale
from core.world.entities.ant.male.male_ant import MaleAnt
from .specie_builder.specie import Specie
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.damage_types import DamageTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.action.nuptial_males_changed_action import NuptialMalesChangedAction
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.settings import MUTATITON_PERCENT, SUPER_MUTATION_CHANCE_PERCENT, SUPER_MUTATION_PERCENT
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from typing import List
import random

class NuptialEnvironment():

    def __init__(self, event_bus: EventEmitter, owner_id: int, specie: Specie, males: List[NuptialMale]):
        self._event_bus = event_bus
        self._specie = specie
        self._owner_id = owner_id
        self._males: List[NuptialMale] = males

        self._event_bus.add_listener('ant_received_damage_stat', self._on_ant_received_damaged)
        self._event_bus.add_listener('ant_damaged_another_body_stat', self._on_ant_damaged_another_body)
        self._event_bus.add_listener('ant_gave_fortification_item_stat', self._on_ant_gave_fortification_item)
        self._event_bus.add_listener('ant_built_nest_stat', self._on_ant_built_nest)
        self._event_bus.add_listener('nuptial_season_start', self._on_nuptial_season_start)
        self._event_bus.add_listener('nuptial_season_stop', self._on_nuptial_season_stop)

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def specie(self) -> Specie:
        return self._specie
    
    @property
    def males(self) -> List[NuptialMale]:
        return self._males
    
    def fly_in_male(self, male: MaleAnt):
        self._specie.accept_male_genome(male.body.genome)
    
    def get_male(self, male_id: str) -> NuptialMale:
        for male in self._males:
            if male.id == male_id:
                self._males.remove(male)
                return male
        
        return None
    
    def _generate_males(self, count = 3):
        self._males = []
        for i in range(count):
            genome = self._specie.generate_nuptial_male_genome(MUTATITON_PERCENT, SUPER_MUTATION_CHANCE_PERCENT, SUPER_MUTATION_PERCENT)
            male = NuptialMale.build_new(genome)
            self._males.append(male)
        self._emit_males_changed_action()

    def _clear_males(self):
        self._males = []
        self._emit_males_changed_action() 
    
    def _on_ant_received_damaged(self, damage_type: DamageTypes, ant: Ant):
        if ant.owner_id == self.owner_id:
            match(damage_type):
                case DamageTypes.COMBAT:
                    self._specie.register_defense_activity()
                case DamageTypes.COLD:
                    self._specie.register_cold_resistance_activity()

    def _on_ant_damaged_another_body(self, ant: Ant):
        if ant.owner_id == self.owner_id:
            self._specie.register_attack_activity()

    def _on_ant_gave_fortification_item(self, ant: Ant):
        if ant.owner_id == self.owner_id:
            self._specie.register_building_activity()

    def _on_ant_built_nest(self, ant: Ant):
        if ant.owner_id == self.owner_id:
            self._specie.register_building_activity()

    def _on_nuptial_season_start(self):
        self._generate_males()

    def _on_nuptial_season_stop(self):
        self._clear_males()

    def _emit_males_changed_action(self):
        self._event_bus.emit('action', NuptialMalesChangedAction(self._males, self._owner_id))