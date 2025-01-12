from .util_client_serializer import UtilClientSerializer
from .base.live_entity_client_serializer import LiveEntityClientSerializer
from .stats_client_serializer import StatsClientSerializer
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from .genome_client_serializer import GenomeClientSerializer
from core.world.entities.ant.male.male_ant import MaleAnt

class AntClientSerializer(LiveEntityClientSerializer):

    def __init__(self, util_serializer: UtilClientSerializer, stats_serializer: StatsClientSerializer, genome_client_serializer: GenomeClientSerializer):
        super().__init__(util_serializer)
        self._stats_serializer = stats_serializer
        self._genome_client_serializer = genome_client_serializer

    def serialize(self, ant: Ant):
        json = super().serialize(ant)

        match(ant.ant_type):
            case AntTypes.WORKER:
                return self._serialize_worker(json, ant)
            case AntTypes.WARRIOR:
                return self._serialize_warrior(json, ant)
            case AntTypes.QUEEN:
                return self._serialize_queen(json, ant)
            case AntTypes.MALE:
                return self._serialize_male(json, ant)
            case _:
                raise Exception('unknown type of ant')

    def _serializer_common(self, json: dict, ant: Ant):
        json.update({
            'name': ant.name,
            'picked_item_id': ant.body.picked_item_id,
            'ant_type': ant.ant_type,
            'located_in_nest_id': ant.body.located_in_nest_id,
            'home_nest_id': ant.home_nest_id,
            'stats': self._stats_serializer.serialize(ant._body.stats),
            'genome': self._genome_client_serializer.serialize_genome(ant.body.genome),
            'behavior': {
                'guardianBehavior': ant.guardian_behavior,
                'isCooperative': ant.is_cooperative
            },
            'birthStep': ant.birth_step,
            'currentActivity': ant.current_activity
        })

        return json
    
    def _serialize_worker(self, json: dict, ant: WorkerAnt):
        return self._serializer_common(json, ant)
    
    def _serialize_warrior(self, json: dict, ant: WarriorAnt):
        return self._serializer_common(json, ant)
    
    def _serialize_queen(self, json: dict, ant: QueenAnt):
        json = self._serializer_common(json, ant)
        json.update({
            'is_fertilized': ant.body.is_fertilized,
            'is_in_nuptial_flight': ant.body.is_in_nuptial_flight,
            'genes': {}
        })

        return json
    
    def _serialize_male(self, json: dict, ant: MaleAnt):
        return self._serializer_common(json, ant)