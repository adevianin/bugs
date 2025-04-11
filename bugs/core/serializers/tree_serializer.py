from .base.entity_serializer import EntitySerializer
from core.world.entities.tree.tree import Tree
from typing import Dict

class TreeSerializer(EntitySerializer):

    def serialize(self, tree: Tree) -> Dict:
        return super().serialize(tree)