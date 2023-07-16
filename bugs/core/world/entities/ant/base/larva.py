from core.world.utils.point import Point
from core.world.entities.ant.base.ant_types import AntTypes

class Larva():

    @classmethod
    def build_larva(cls, ant_type: AntTypes, dna_profile: str, ate_calories: int):
        return Larva(ant_type, dna_profile, ate_calories)

    def __init__(self, ant_type: AntTypes, dna_profile: str, ate_calories: int):
        self._ant_type = ant_type
        self._ate_calories = ate_calories
        self._dna_profile = dna_profile

    @property
    def dna_profile(self):
        return self._dna_profile

    @property
    def ant_type(self):
        return self._ant_type

    @property
    def is_ready_to_born(self):
        return self.progress >= 100
    
    @property
    def ate_calories(self):
        return self._ate_calories

    @property
    def progress(self):
        return (100 / self._get_needed_calories()) * self._ate_calories

    def feed(self, calories_count: int):
        self._ate_calories += calories_count

    def to_public_json(self):
        return {
            'ant_type': self.ant_type,
            'progress': self.progress
        }
    
    def _get_needed_calories(self):
        match self._ant_type:
            case AntTypes.WORKER:
                return 100
            case AntTypes.WARRIOR:
                return 500