from .live_entity.live_stats import LiveStats
from .basic_stats import BasicStats

class StatsLibrary():
    GHOST_DEFAULT = BasicStats.build(max_hp=1, hp_regen_rate=1)
    GROUND_BEETLE_DEFAULT = LiveStats.build(max_hp=800, hp_regen_rate=10, distance_per_step=32, sight_distance=200, max_calories=1, distance_per_calorie=1, attack=20, defence=5)
    ITEM_SOURCE_DEFAULT = BasicStats.build(max_hp=100, hp_regen_rate=0.05)
    NEST_DEFAULT = BasicStats.build(max_hp=1000, hp_regen_rate=10)
