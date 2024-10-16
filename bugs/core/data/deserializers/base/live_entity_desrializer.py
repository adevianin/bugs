from .entity_deserializer import EntityDeserializer
from core.world.entities.base.live_entity.memory import Memory

class LiveEntityDeserializer(EntityDeserializer):

    def parse_live_entity_props(self, json: dict):
        props = self.parse_entity_props(json)
        props.update({
            'memory': Memory(json['memory']),
            'birth_step': json['birth_step'],
            'is_auto_thought_generation': json['is_auto_thought_generation']
        })

        return props