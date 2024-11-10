from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .genes_serializer import GenesSerializer
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_gene import SpecieGene
from core.world.entities.ant.base.nuptial_environment.specie_builder.activity_weights_pack import ActivityWeightsPack
from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from .genome_serializer import GenomeSerializer

class NuptialEnvironmentSerializer():

    def __init__(self, genes_serializer: GenesSerializer, genome_serializer: GenomeSerializer):
        self._genes_serializer = genes_serializer
        self._genome_serializer = genome_serializer

    def serialize(self, nuptial_environment: NuptialEnvironment):
        return {
            'owner_id': nuptial_environment.owner_id,
            'specie': self._serialize_specie(nuptial_environment.specie),
            'males': [self._serialize_nuptial_male(male) for male in nuptial_environment.males]
        }
    
    def _serialize_nuptial_male(self, nuptial_male: NuptialMale):
        return {
            'id': nuptial_male.id,
            'genome': self._genome_serializer.serialize_genome(nuptial_male.genome)
        }
    
    def _serialize_specie(self, specie: Specie):
        return {
            'chromosomes_set': [self._serialize_specie_chromosome(specie_chromosome) for specie_chromosome in specie.specie_chromosome_set.specie_chromosomes],
            'activity_weights': self._serialize_activity_weights(specie.activity_weights)
        }
    
    def _serialize_activity_weights(self, activity_weights: ActivityWeightsPack):
        return  {
            "attack_weight": activity_weights.attack_weight,
            "defense_weight": activity_weights.defense_weight,
            "cold_resistance_weight": activity_weights.cold_resistance_weight,
            "building_weight": activity_weights.building_weight
        }
    
    def _serialize_specie_chromosome(self, specie_chromosome: SpecieChromosome):
        return {
            'type': specie_chromosome.type,
            'activated_specie_genes_ids': specie_chromosome.activated_specie_genes_ids,
            'specie_genes': [self._serialize_specie_gene(specie_gene) for specie_gene in specie_chromosome.specie_genes]
        }
    
    def _serialize_specie_gene(self, specie_gene: SpecieGene):
        return {
            'id': specie_gene.id,
            'gene': self._genes_serializer.serialize(specie_gene.gene)
        }