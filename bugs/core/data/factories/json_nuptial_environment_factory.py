from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .json_genes_factory import JsonGenesFactory
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome_set import SpecieChromosomeSet
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_gene import SpecieGene

class JsonNuptialEnvironmentFactory():

    def __init__(self, json_genes_factory: JsonGenesFactory):
        self._json_genes_factory = json_genes_factory

    def build_nuptial_environment_from_json(self, json: dict):
        owner_id = json['owner_id']
        specie = self._build_specie(json['specie'])
        return NuptialEnvironment.build(owner_id, specie)
    
    def _build_specie(self, specie_json: dict):
        chromosome = self._build_specie_chromosome_set(specie_json)
        return Specie.build(chromosome)

    def _build_specie_chromosome_set(self, specie_chromosome_set_json: dict):
        body = self._build_specie_chromosome(specie_chromosome_set_json['body'])
        development = self._build_specie_chromosome(specie_chromosome_set_json['development'])
        adaptation = self._build_specie_chromosome(specie_chromosome_set_json['adaptation'])
        building = self._build_specie_chromosome(specie_chromosome_set_json['building'])
        combat = self._build_specie_chromosome(specie_chromosome_set_json['combat'])
        adjusting = self._build_specie_chromosome(specie_chromosome_set_json['adjusting'])
        return SpecieChromosomeSet.build(body, development, adaptation, building, combat, adjusting)
    
    def _build_specie_chromosome(self, specie_chromosome_json: dict):
        genes = [self._build_specie_gene(specie_gene_json) for specie_gene_json in specie_chromosome_json['specie_genes']]
        return SpecieChromosome.build(specie_chromosome_json['activated_specie_genes_ids'], genes)
    
    def _build_specie_gene(self, specie_gene_json: dict):
        gene = self._json_genes_factory.build_gene_from_json(specie_gene_json['gene'])
        return SpecieGene.build(specie_gene_json['id'], gene)
