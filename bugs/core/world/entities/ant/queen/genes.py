from core.world.entities.base.live_entity.live_stats import LiveStats

class Genes():

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
    

    def to_public_json(self):
        return {
            "queen_food_required": self.queen_food_required,
            "warrior_food_required": self.warrior_food_required,
            "worker_food_required": self.worker_food_required,
            "worker_stats": self._worker_stats.to_public_json(),
            "warrior_stats": self._warrior_stats.to_public_json(),
            "queen_stats": self._queen_stats.to_public_json()
        }