from .base.entity_client_serializer import EntityClientSerializer
from core.world.entities.tree.tree import Tree

class TreeClientSerializer(EntityClientSerializer):

    def serialize(self, tree: Tree):
        json = super().serialize(tree)

        return json