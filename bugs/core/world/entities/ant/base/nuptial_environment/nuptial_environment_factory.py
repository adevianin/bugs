from .nuptial_environment import NuptialEnvironment
from core.world.entities.ant.base.genes import Genes
from core.world.utils.event_emiter import EventEmitter

class NuptialEnvironmentFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build(self, owner_id: int, base_genes: Genes) -> NuptialEnvironment:
        return NuptialEnvironment(self._event_bus, owner_id, base_genes)