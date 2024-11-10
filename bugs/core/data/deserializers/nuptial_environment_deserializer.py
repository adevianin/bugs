from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from .gene_deserializer import GeneDeserializer
from .genome_deserializer import GenomeDeserializer
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.specie_builder.activity_weights_pack import ActivityWeightsPack
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome_set import SpecieChromosomeSet
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_gene import SpecieGene
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory

from typing import List, Dict

class NuptialEnvironmentDeserializer():

    def __init__(self, gene_deserializer: GeneDeserializer, genome_deserializer: GenomeDeserializer, nuptial_environment_factory: NuptialEnvironmentFactory):
        self._gene_deserializer = gene_deserializer
        self._genome_deserializer = genome_deserializer
        self._nuptial_environment_factory = nuptial_environment_factory

    def deserialize_nuptial_environment(self, json: dict):
        owner_id = json['owner_id']
        specie = self._deserialize_specie(json['specie'])
        males = [self._deserialize_nuptial_male(male_json) for male_json in json['males']]
        return self._nuptial_environment_factory.build_nuptial_environment(owner_id, specie, males)
    
    def _deserialize_nuptial_male(self, json: Dict):
        genome = self._genome_deserializer.deserialize_genome(json['genome'])
        return NuptialMale(json['id'], genome)
    
    def _deserialize_specie(self, specie_json: dict):
        chromosomes_set = self._build_specie_chromosome_set(specie_json['chromosomes_set'])
        activity_weights = self._deserialize_activity_weights(specie_json['activity_weights'])
        return Specie.build(chromosomes_set, activity_weights)
    
    def _deserialize_activity_weights(self, json):
        attack_weight = json['attack_weight']
        defense_weight = json['defense_weight']
        cold_resistance_weight = json['cold_resistance_weight']
        building_weight = json['building_weight']
        return ActivityWeightsPack(attack_weight, defense_weight, cold_resistance_weight, building_weight)

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
