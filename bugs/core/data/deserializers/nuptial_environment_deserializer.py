from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .gene_deserializer import GeneDeserializer
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome_set import SpecieChromosomeSet
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_gene import SpecieGene
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory

from typing import List

class NuptialEnvironmentDeserializer():

    def __init__(self, gene_deserializer: GeneDeserializer, nuptial_environment_factory: NuptialEnvironmentFactory):
        self._gene_deserializer = gene_deserializer
        self._nuptial_environment_factory = nuptial_environment_factory

    def deserialize_nuptial_environment(self, json: dict):
        owner_id = json['owner_id']
        specie = self._build_specie(json['specie'])
        specie_activity_json = json['specie_activity']
        attack_weight = specie_activity_json['attack_weight']
        defense_weight = specie_activity_json['defense_weight']
        cold_resistance_weight = specie_activity_json['cold_resistance_weight']
        building_weight = specie_activity_json['building_weight']
        return self._nuptial_environment_factory.build_nuptial_environment(owner_id, specie, attack_weight, defense_weight, cold_resistance_weight, building_weight)
    
    def _build_specie(self, specie_json: dict):
        chromosomes_set = self._build_specie_chromosome_set(specie_json['chromosomes_set'])
        return Specie.build(chromosomes_set)

    def _build_specie_chromosome_set(self, specie_chromosomes_json: List[dict]):
        specie_chromosomes = [self._build_specie_chromosome(specie_chromosome_json) for specie_chromosome_json in specie_chromosomes_json]
        return SpecieChromosomeSet.build(specie_chromosomes)
    
    def _build_specie_chromosome(self, specie_chromosome_json: dict):
        type = ChromosomeTypes(specie_chromosome_json['type'])
        genes = [self._build_specie_gene(specie_gene_json) for specie_gene_json in specie_chromosome_json['specie_genes']]
        return SpecieChromosome.build(type, specie_chromosome_json['activated_specie_genes_ids'], genes)
    
    def _build_specie_gene(self, specie_gene_json: dict):
        gene = self._gene_deserializer.deserialize_gene(specie_gene_json['gene'])
        return SpecieGene.build(specie_gene_json['id'], gene)
