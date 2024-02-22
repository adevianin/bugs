from core.world.entities.base.live_entity.live_stats import LiveStats

class Genes():

    @classmethod
    def cross_live_stats(cls, stats1: LiveStats, stats2: LiveStats) -> LiveStats:
        attack = (stats1.attack + stats2.attack) / 2
        defence = (stats1.defence + stats2.defence) / 2
        sight_distance = (stats1.sight_distance + stats2.sight_distance) / 2
        distance_per_step = (stats1.distance_per_step + stats2.distance_per_step) / 2
        max_hp = (stats1.max_hp + stats2.max_hp) / 2
        hp_regen_rate = (stats1.hp_regen_rate + stats2.hp_regen_rate) / 2

        return LiveStats.build(max_hp, hp_regen_rate, distance_per_step, sight_distance, attack, defence)

    @classmethod
    def build(cls, worker_stats: LiveStats, worker_food_required: int, warrior_stats: LiveStats, warrior_food_required: int, queen_stats: LiveStats, queen_food_required: int):
        return Genes(worker_stats, worker_food_required, warrior_stats, warrior_food_required, queen_stats, queen_food_required)

    def __init__(self, worker_stats: LiveStats, worker_food_required: int, warrior_stats: LiveStats, warrior_food_required: int, queen_stats: LiveStats, queen_food_required: int):
        self._worker_stats = worker_stats
        self._worker_food_required = worker_food_required
        self._warrior_stats = warrior_stats
        self._warrior_food_required = warrior_food_required
        self._queen_stats = queen_stats
        self._queen_food_required = queen_food_required

    def get_worker_stats(self) -> LiveStats:
        return self._worker_stats.clone()
    
    @property
    def worker_food_required(self):
        return self._worker_food_required
    
    def get_warrior_stats(self) -> LiveStats:
        return self._warrior_stats.clone()
    
    @property
    def warrior_food_required(self):
        return self._warrior_food_required 
    
    def get_queen_stats(self) -> LiveStats:
        return self._queen_stats.clone()
    
    @property
    def queen_food_required(self):
        return self._queen_food_required
    
    def cross(self, genes: 'Genes'):
        self._worker_stats = Genes.cross_live_stats(self._worker_stats, genes.get_worker_stats())
        self._warrior_stats = Genes.cross_live_stats(self._warrior_stats, genes.get_warrior_stats())
        self._queen_stats = Genes.cross_live_stats(self._queen_stats, genes.get_queen_stats())
        self._worker_food_required = (self.worker_food_required + genes.worker_food_required) / 2
        self._warrior_food_required = (self.warrior_food_required + genes.warrior_food_required) / 2
        self._queen_food_required = (self.queen_food_required + genes.queen_food_required) / 2

    
    