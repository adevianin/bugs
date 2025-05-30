from .live_entity.live_stats import LiveStats
from .basic_stats import BasicStats
from core.world.entities.nest.nest_stats import NestStats
from core.world.settings import STEPS_IN_YEAR

class StatsLibrary():
    GHOST_DEFAULT = BasicStats.build(max_hp=1, hp_regen_rate=1)
    LADYBUG_DEFAULT = LiveStats.build(max_hp=300, hp_regen_rate=5, distance_per_step=32, sight_distance=200, strength=15, defence=6, appetite=0, min_temperature=-1, life_span=1 * STEPS_IN_YEAR)
    ITEM_SOURCE_DEFAULT = BasicStats.build(max_hp=100, hp_regen_rate=0.05)
    NEST_DEFAULT = NestStats.build(max_hp=1000, hp_regen_rate=10, max_fortification=1000)
