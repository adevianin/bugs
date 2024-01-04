from .stats_types import StatsTypes

class BasicStats():

    @classmethod
    def build(cls, max_hp: int, hp_regen_rate: int):
        return BasicStats(StatsTypes.BASIC, max_hp, hp_regen_rate)

    def __init__(self, type: StatsTypes, max_hp: int, hp_regen_rate: int):
        self._type = type
        self.max_hp = max_hp
        self.hp_regen_rate = hp_regen_rate

    @property
    def type(self) -> StatsTypes:
        return self._type
    
    def clone(self) -> 'BasicStats':
        return BasicStats(self.max_hp, self.hp_regen_rate)
    