from .base.live_entity_serializer import LiveEntitySerializer
from core.world.entities.ant.base.ant import Ant
from .thought_serializer import ThoughtSerializer
from .stats_serializer import StatsSerializer

class AntSerializer(LiveEntitySerializer):

    def __init__(self, stats_serializer: StatsSerializer, thought_serializer: ThoughtSerializer):
        self._thought_serializer = thought_serializer
        self._stats_serializer = stats_serializer

    def serialize(self, ant: Ant):
        json = super().serialize(ant)

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