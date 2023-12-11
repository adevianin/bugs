from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.live_entity.live_stats import LiveStats

class Larva():

    @classmethod
    def build_new(cls, ant_type: AntTypes, needed_calories: int, stats: LiveStats):
        return Larva(ant_type, 0, needed_calories, stats)
    
    @classmethod
    def build(cls, ant_type: AntTypes, ate_calories: int, needed_calories: int, stats: LiveStats):
        return Larva(ant_type, ate_calories, needed_calories, stats)

    def __init__(self, ant_type: AntTypes, ate_calories: int, needed_calories: int, stats: LiveStats):
        self._ant_type = ant_type
        self._ate_calories = ate_calories
        self._needed_calories = needed_calories
        self._stats = stats

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
    def needed_calories(self):
        return self._needed_calories
    
    @property
    def stats(self) -> LiveStats:
        return self._stats

    @property
    def progress(self):
        return (100 / self._needed_calories) * self._ate_calories

    def feed(self, calories_count: int):
        self._ate_calories += calories_count

    def to_public_json(self):
        return {
            'ant_type': self.ant_type,
            'progress': self.progress
        }
    