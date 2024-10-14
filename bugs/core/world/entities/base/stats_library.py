from .live_entity.live_stats import LiveStats
from .basic_stats import BasicStats
from core.world.entities.nest.nest_stats import NestStats

class StatsLibrary():
    GHOST_DEFAULT = BasicStats.build(max_hp=1, hp_regen_rate=1)
    GROUND_BEETLE_DEFAULT = LiveStats.build(max_hp=800, hp_regen_rate=10, distance_per_step=32, sight_distance=200, attack=20, defence=5, appetite=0, min_temperature=-10, life_span=-1)
    ITEM_SOURCE_DEFAULT = BasicStats.build(max_hp=100, hp_regen_rate=0.05)
    NEST_DEFAULT = NestStats.build(max_hp=1000, hp_regen_rate=10, max_fortification=1000)
