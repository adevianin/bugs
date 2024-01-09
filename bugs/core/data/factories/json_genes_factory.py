from core.world.entities.ant.base.genes import Genes
from .json_stats_factory import JsonStatsFactory

class JsonGenesFactory():

    def __init__(self, json_stats_factory: JsonStatsFactory):
        self._json_stats_factory = json_stats_factory

    def build_genes_from_json(self, genes_json: dict) -> Genes:
        worker_stats = self._json_stats_factory.build_stats(genes_json['worker_stats'])
        worker_food_required = genes_json['worker_food_required']
        warrior_stats = self._json_stats_factory.build_stats(genes_json['warrior_stats'])
        warrior_food_required = genes_json['warrior_food_required']
        queen_stats = self._json_stats_factory.build_stats(genes_json['queen_stats'])
        queen_food_required = genes_json['queen_food_required']
        return Genes.build(worker_stats, worker_food_required, warrior_stats, warrior_food_required, queen_stats, queen_food_required)
