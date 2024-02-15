from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.ant.base.genetic.genes.genes_types import GenesTypes
from ..base_gene import BaseGene
from core.world.entities.ant.base.ant_types import AntTypes

class WorkerCasteDevelopmentGene(BaseGene):

    @classmethod
    def build(cls, domination_lvl: int):
        return WorkerCasteDevelopmentGene(domination_lvl)

    def __init__(self, domination_lvl: int):
        super().__init__(GenesTypes.WORKER_CASTE_DEVELOPMENT, domination_lvl)

    def affect_stats(self, stats: LiveStats):
        pass

    def merge(self, another_gene: BaseGene) -> 'WorkerCasteDevelopmentGene':
        return another_gene