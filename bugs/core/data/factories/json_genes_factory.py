from core.world.entities.ant.base.genetic.genes.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.genes_types import GenesTypes
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.genetic.genes.base_chromosome.strength_gene import StrengthGene
from core.world.entities.ant.base.genetic.genes.development_chromosome.strength_development_gene import StrengthDevelopmentGene
from core.world.entities.ant.base.genetic.genes.development_chromosome.worker_caste_development_gene import WorkerCasteDevelopmentGene

class JsonGenesFactory():

    def build_gene_from_json(self, gene_json: dict) -> BaseGene:
        match gene_json['type']:
            case GenesTypes.STRENGTH:
                return self._build_strength_gene(gene_json)
            case GenesTypes.STRENGTH_DEVELOPMENT:
                return self._build_strength_development_gene(gene_json)
            case GenesTypes.WORKER_CASTE_DEVELOPMENT:
                return self._build_worker_caste_development_gene(gene_json)
            case _:
                raise Exception('unknown gene')
            
    def _build_strength_gene(self, gene_json: dict):
        return StrengthGene.build(gene_json['domination_lvl'], gene_json['strength'])
    
    def _build_strength_development_gene(self, gene_json: dict):
        return StrengthDevelopmentGene.build(gene_json['domination_lvl'], gene_json['multiplier'], AntTypes(gene_json['ant_type']))
    
    def _build_worker_caste_development_gene(self, gene_json: dict):
        return WorkerCasteDevelopmentGene.build(gene_json['domination_lvl'])
