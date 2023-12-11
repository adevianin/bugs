from core.world.entities.ant.base.larva import Larva
from core.world.entities.ant.base.ant_types import AntTypes
from .json_stats_factory import JsonStatsFactory

class JsonLarvaFactory():

    def __init__(self, json_stats_factory: JsonStatsFactory):
        self._json_stats_factory = json_stats_factory

    def build_larva(self, larva_json: dict):
        ant_type = AntTypes(larva_json['ant_type'])
        ate_calories = larva_json['ate_calories']
        needed_calories = larva_json['needed_calories']
        stats = self._json_stats_factory.build_stats(larva_json['stats'])
        return Larva.build(ant_type, ate_calories, needed_calories, stats)
