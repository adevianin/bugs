from .nuptial_male import NuptialMale
from core.world.entities.ant.male.male_ant import MaleAnt
from .specie_builder.specie import Specie
from core.world.entities.world.player_stats import PlayerStats
from core.world.utils.event_emiter import EventEmitter
from typing import List

class NuptialEnvironment():

    def __init__(self, event_bus: EventEmitter, owner_id: int, specie: Specie, player_stats: PlayerStats):
        self._event_bus = event_bus
        self._specie = specie
        self._player_stats = player_stats
        self._owner_id = owner_id
        self._males: List[NuptialMale] = []

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def specie(self) -> Specie:
        return self._specie
    
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
    