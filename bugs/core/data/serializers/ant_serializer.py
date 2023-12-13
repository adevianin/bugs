from .base.live_entity_serializer import LiveEntitySerializer
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.ant.base.ant_types import AntTypes
from .thought_serializer import ThoughtSerializer
from .stats_serializer import StatsSerializer
from core.world.entities.ant.queen.genes import Genes

class AntSerializer(LiveEntitySerializer):

    def __init__(self, stats_serializer: StatsSerializer, thought_serializer: ThoughtSerializer):
        self._thought_serializer = thought_serializer
        self._stats_serializer = stats_serializer

    def serialize(self, ant: Ant):
        json = super().serialize(ant)

        match(ant.ant_type):
            case AntTypes.WORKER:
                return self._serialize_worker(json, ant)
            case AntTypes.WARRIOR:
                return self._serialize_warrior(json, ant)
            case AntTypes.QUEEN:
                return self._serialize_queen(json, ant)

        return json
    
    def _serialize_worker(self, json: dict, ant: Ant):
        return self._serialize_common(json, ant)
    
    def _serialize_warrior(self, json: dict, ant: Ant):
        return self._serialize_common(json, ant)
    
    def _serialize_queen(self, json: dict, ant: QueenAnt):
        json = self._serialize_common(json, ant)

        json.update({
            "genes": self._serialize_genes(ant.body.genes)
        })

        return json
    
    def _serialize_common(self, json: dict, ant: Ant):
        thoughts_json = []
        for thought in ant.mind.thoughts:
            thoughts_json.append(self._thought_serializer.serialize(thought))

        json.update({
            'picked_item_id': ant.body.picked_item_id,
            'ant_type': ant.ant_type,
            'from_nest': ant.home_nest_id,
            'thoughts': thoughts_json,
            'is_auto_thought_generation': ant.mind.is_auto_thought_generation,
            'is_in_operation': ant.mind.is_in_opearetion,
            'located_in_nest_id': ant.located_in_nest_id,
            'stats': self._stats_serializer.serialize(ant.body.stats)
        })

        return json
    
    def _serialize_genes(self, genes: Genes):
        json = {}

        worker_stats_json = self._stats_serializer.serialize(genes.get_worker_stats())
        warrior_stats_json = self._stats_serializer.serialize(genes.get_warrior_stats())
        queen_stats_json = self._stats_serializer.serialize(genes.get_queen_stats())
        
        json.update({
            "queen_food_required": genes.queen_food_required,
            "warrior_food_required": genes.warrior_food_required,
            "worker_food_required": genes.worker_food_required,
            "worker_stats": worker_stats_json,
            "warrior_stats": warrior_stats_json,
            "queen_stats": queen_stats_json,
        })

        return json
