from core.world.entities.ant.base.genes import Genes
from .stats_serializer import StatsSerializer

class GenesSerializer():

    def __init__(self, stats_serializer: StatsSerializer):
        self._stats_serializer = stats_serializer

    def serialize(self, genes: Genes):
        worker_stats_json = self._stats_serializer.serialize(genes.get_worker_stats())
        warrior_stats_json = self._stats_serializer.serialize(genes.get_warrior_stats())
        queen_stats_json = self._stats_serializer.serialize(genes.get_queen_stats())
        
        return {
            "queen_food_required": genes.queen_food_required,
            "warrior_food_required": genes.warrior_food_required,
            "worker_food_required": genes.worker_food_required,
            "worker_stats": worker_stats_json,
            "warrior_stats": warrior_stats_json,
            "queen_stats": queen_stats_json,
        }