from core.sync.util_client_serializer import UtilClientSerializer
from .base.live_entity_client_serializer import LiveEntityClientSerializer
from core.sync.stats_client_serializer import StatsClientSerializer
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt

class AntClientSerializer(LiveEntityClientSerializer):

    def __init__(self, util_serializer: UtilClientSerializer, stats_serializer: StatsClientSerializer):
        super().__init__(util_serializer)
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

    def _serializer_common(self, json: dict, ant: Ant):
        json.update({
            'picked_item_id': ant.body.picked_item_id,
            'ant_type': ant.ant_type,
            'located_in_nest_id': ant.body.located_in_nest_id,
            'home_nest_id': ant.mind.home_nest.id,
            'stats': self._stats_serializer.serialize(ant._body.stats)
        })

        return json
    
    def _serialize_worker(self, json: dict, ant: WorkerAnt):
        return self._serializer_common(json, ant)
    
    def _serialize_warrior(self, json: dict, ant: WarriorAnt):
        return self._serializer_common(json, ant)
    
    def _serialize_queen(self, json: dict, ant: QueenAnt):
        json = self._serializer_common(json, ant)
        genes = ant.body.genes
        json.update({
            'is_fertilized': ant.body.is_fertilized,
            'is_in_nuptial_flight': ant.body.is_in_nuptial_flight,
            'genes': {
                'queenFoodRequired': genes.queen_food_required,
                'warriorFoodRequired': genes.warrior_food_required,
                'workerFoodRequired': genes.worker_food_required,
                'workerStats': self._stats_serializer.serialize(genes.get_worker_stats()),
                'warriorStats': self._stats_serializer.serialize(genes.get_warrior_stats()),
                'queenStats': self._stats_serializer.serialize(genes.get_queen_stats())
            }
        })

        return json