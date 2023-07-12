from .live_entity_serializer import LiveEntitySerializer
from core.world.entities.ant.base.ant import Ant
from .thought_serializer import ThoughtSerializer

class AntSerializer(LiveEntitySerializer):

    def __init__(self, thought_serializer: ThoughtSerializer):
        self._thought_serializer = thought_serializer

    def serialize(self, entity: Ant):
        json = super().serialize(entity)

        thoughts_json = []
        for thought in entity.mind.thoughts:
            thoughts_json.append(self._thought_serializer.serialize(thought))

        json.update({
            'picked_food_id': entity.body.picked_food_id,
            'ant_type': entity.ant_type,
            'dna_profile': entity.body.dna_profile,
            'from_nest': entity.mind.home_nest.id,
            'thoughts': thoughts_json,
            'is_auto_thought_generation': entity.mind.is_auto_thought_generation
        })

        return json