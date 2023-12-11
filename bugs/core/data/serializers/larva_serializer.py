from core.world.entities.ant.base.larva import Larva
from .stats_serializer import StatsSerializer

from typing import List

class LarvaSerializer():

    def __init__(self, stats_serializer: StatsSerializer):
        self._stats_serializer = stats_serializer

    def serialize_larva(self, larva: Larva):
        json = {}
        json.update({
            'ant_type': larva.ant_type,
            'ate_calories': larva.ate_calories,
            'needed_calories': larva.needed_calories,
            'stats': self._stats_serializer.serialize(larva.stats)
        })

        return json
    
    def serialize_larvae(self, larvae: List[Larva]):
        json = []

        for larva in larvae:
            json.append(self.serialize_larva(larva))
    
        return json