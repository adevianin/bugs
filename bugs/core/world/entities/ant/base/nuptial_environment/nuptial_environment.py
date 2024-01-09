from core.world.entities.ant.base.genes import Genes
from core.world.utils.event_emiter import EventEmitter

class NuptialEnvironment():

    @classmethod
    def build(cls, event_bus: EventEmitter, owner_id: int, base_genes: Genes):
        return NuptialEnvironment(event_bus, owner_id, base_genes)

    def __init__(self, event_bus: EventEmitter, owner_id: int, base_genes: Genes):
        self._event_bus = event_bus
        self._base_genes = base_genes
        self._owner_id = owner_id

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def base_genes(self):
        return self._base_genes
    
    def absorb_genes(self, genes: Genes):
        pass
    
    def generate_males(self):
        print('generating males in env ', self._owner_id)
    
    