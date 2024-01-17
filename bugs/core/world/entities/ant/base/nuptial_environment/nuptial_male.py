from core.world.entities.ant.base.genes import Genes
import uuid

class NuptialMale():

    @classmethod
    def build(cls, genes: Genes):
        id = uuid.uuid4().hex
        return NuptialMale(id, genes)

    def __init__(self, id: str, genes: Genes):
        self.id = id
        self.genes = genes