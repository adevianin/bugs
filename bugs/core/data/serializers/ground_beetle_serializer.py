from .live_entity_serializer import LiveEntitySerializer
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from .thought_serializer import ThoughtSerializer

class GroundBeetleSerializer(LiveEntitySerializer):

    def __init__(self, thought_serializer: ThoughtSerializer):
        self._thought_serializer = thought_serializer

    def serialize(self, ground_beetle: GroundBeetle):
        json = super().serialize(ground_beetle)

        thoughts_json = []
        for thought in ground_beetle.mind.thoughts:
            thoughts_json.append(self._thought_serializer.serialize(thought))

        json.update({
            'dna_profile': ground_beetle.body.dna_profile,
            'thoughts': thoughts_json,
            'is_auto_thought_generation': ground_beetle.mind.is_auto_thought_generation
        })

        return json