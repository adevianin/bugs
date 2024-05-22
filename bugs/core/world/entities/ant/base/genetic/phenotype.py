from core.world.entities.ant.base.ant_types import AntTypes

class Phenotype():

    @classmethod
    def build_empty(cls, ant_type: AntTypes):
        return Phenotype(ant_type, 0, 0, 0, 0, 0, 0, 0, 0, 0)

    def __init__(self, ant_type: AntTypes, strength: int, defense: int, max_hp: int, hp_regen_rate: int, speed: int, sight_distance: int, appetite: int, required_food: int, min_temperature: int):
        self._ant_type = ant_type
        self.strength = strength
        self.defense = defense
        self.max_hp = max_hp
        self.hp_regen_rate = hp_regen_rate
        self.speed = speed
        self.sight_distance = sight_distance
        self.appetite = appetite
        self.required_food = required_food
        self.min_temperature = min_temperature

    @property
    def ant_type(self) -> AntTypes:
        return self._ant_type