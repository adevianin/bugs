from core.world.entities.nest.nest_factory import NestFactory
from .larva_deserializer import LarvaDeserializer
from .egg_deserializer import EggDeserializer
from .base.entity_deserializer import EntityDeserializer

class NestDeserializer(EntityDeserializer):

    def __init__(self, larva_deserializer: LarvaDeserializer, egg_deserializer: EggDeserializer, nest_factory: NestFactory):
        self._larva_deserializer = larva_deserializer
        self._egg_deserializer = egg_deserializer
        self._nest_factory = nest_factory

    def deserialize_nest(self, nest_json: dict):
        props = self._parse_props(nest_json)
        return self._nest_factory.build_nest(**props)
    
    def _parse_props(self, nest_json: dict):
        props = self.parse_entity_props(nest_json)
        props.update({
            'stored_calories': nest_json['stored_calories'],
            'area': nest_json['area'],
            'build_progress': nest_json['build_progress'],
            'fortification': nest_json['fortification'],
            'larvae': [self._larva_deserializer.deserialize_larva(larva_json) for larva_json in nest_json['larvae']],
            'eggs': [self._egg_deserializer.deserialize_egg(egg_json) for egg_json in nest_json['eggs']]
        })
        return props
    