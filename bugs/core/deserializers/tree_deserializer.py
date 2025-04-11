from core.world.entities.tree.tree_factory import TreeFactory
from .base.entity_deserializer import EntityDeserializer

from typing import Dict

class TreeDeserializer(EntityDeserializer):

    def __init__(self, tree_factory: TreeFactory):
        self._tree_factory = tree_factory

    def deserialize(self, json: Dict):
        props = self.parse_entity_props(json)
        return self._tree_factory.build_tree(**props)
