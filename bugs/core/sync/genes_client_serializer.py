from core.world.entities.ant.base.genes import Genes
from .stats_client_serializer import StatsClientSerializer

class GenesClientSerializer():

    def __init__(self, stats_serializer: StatsClientSerializer):
        self._stats_serializer = stats_serializer

    def serialize(self, genes: Genes):
        return {
            'queenFoodRequired': genes.queen_food_required,
            'warriorFoodRequired': genes.warrior_food_required,
            'workerFoodRequired': genes.worker_food_required,
            'workerStats': self._stats_serializer.serialize(genes.get_worker_stats()),
            'warriorStats': self._stats_serializer.serialize(genes.get_warrior_stats()),
            'queenStats': self._stats_serializer.serialize(genes.get_queen_stats())
        }