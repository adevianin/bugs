from .base.live_entity_serializer import LiveEntitySerializer
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.ant.base.ant_types import AntTypes
from .genome_serializer import GenomeSerializer

class AntSerializer(LiveEntitySerializer):

    def __init__(self, genome_serializer: GenomeSerializer):
        self._genome_serializer = genome_serializer

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

    def _serialize_worker(self, json: dict, ant: Ant):
        return self._serialize_common(json, ant)
    
    def _serialize_warrior(self, json: dict, ant: Ant):
        return self._serialize_common(json, ant)
    
    def _serialize_male(self, json: dict, ant: Ant):
        return self._serialize_common(json, ant)
    
    def _serialize_queen(self, json: dict, ant: QueenAnt):
        json = self._serialize_common(json, ant)

        male_chromosomes_set_json = self._genome_serializer.serialize_chromosomes_set(ant.body.male_chromosomes_set) if ant.body.male_chromosomes_set else None

        json.update({
            "male_chromosomes_set": male_chromosomes_set_json,
            "is_in_nuptial_flight": ant.body.is_in_nuptial_flight
        })

        return json
    
    def _serialize_common(self, json: dict, ant: Ant):
        json.update({
            'name': ant.name,
            'picked_item_id': ant.body.picked_item_id,
            'ant_type': ant.ant_type,
            'from_nest': ant.home_nest_id,
            'is_in_operation': ant.mind.is_in_opearetion,
            'located_in_nest_id': ant.located_in_nest_id,
            'genome': self._genome_serializer.serialize_genome(ant.body.genome),
            'is_cooperative': ant.is_cooperative,
            'guardian_behavior': ant.guardian_behavior
        })

        return json
    