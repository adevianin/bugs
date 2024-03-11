from .chromosomes_set import ChromosomesSet
from .phenotype import Phenotype
from core.world.entities.ant.base.ant_types import AntTypes
from .genes.base.base_gene import BaseGene
from .genes.base.genes_types import GenesTypes

from typing import List, Dict
import random

class Genome():

    @classmethod
    def build(cls, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        return Genome(maternal_chromosomes_set, paternal_chromosomes_set)

    def __init__(self, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        self._maternal = maternal_chromosomes_set
        self._paternal = paternal_chromosomes_set

    @property
    def maternal_chromosomes_set(self) -> ChromosomesSet:
        return self._maternal
    
    @property
    def paternal_chromosomes_set(self) -> ChromosomesSet:
        return self._paternal
    
    def get_genes(self) -> List[BaseGene]:
        genes = []

        genes += self._maternal.get_genes()
        genes += self._paternal.get_genes() if self._paternal else []

        return genes

    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int):
        maternal_chromosomes_set = self._maternal.mutate(percent, super_mutate_chance, super_mutate_percent)
        paternal_chromosomes_set = self._paternal.mutate(percent, super_mutate_chance, super_mutate_percent) if self._paternal else None
        return Genome.build(maternal_chromosomes_set, paternal_chromosomes_set)
    
    def meiosis(self) -> ChromosomesSet:
        base_chromosome = random.choice([self._maternal.body_chromosome, self._paternal.body_chromosome])
        development_chromosome = random.choice([self._maternal.development_chromosome, self._paternal.development_chromosome])
        adaptation_chromosome = random.choice([self._maternal.adaptation_chromosome, self._paternal.adaptation_chromosome])
        building_chromosome = random.choice([self._maternal.building_chromosome, self._paternal.building_chromosome])
        combat_chromosome = random.choice([self._maternal.combat_chromosome, self._paternal.combat_chromosome])
        adjusting_chromosome = random.choice([self._maternal.adjusting_chromosome, self._paternal.adjusting_chromosome])
        return ChromosomesSet.build(base_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)
    
    def generate_phenotype(self, ant_type: AntTypes) -> Phenotype:
        phenotype = Phenotype.build_empty(ant_type)
        paternal_genes = self._paternal.get_genes() if self._paternal else []
        maternal_genes = self._maternal.get_genes()
        all_genes = paternal_genes + maternal_genes
        genes_by_types: Dict[GenesTypes, List[BaseGene]] = {}
        for gene in all_genes:
            genes_by_type: List[BaseGene] = genes_by_types.get(gene.type, [])
            genes_by_type.append(gene)
            genes_by_types[gene.type] = genes_by_type

        merged_genes: List[BaseGene] = []
        for type in genes_by_types:
            genes_by_type = genes_by_types[type]
            if len(genes_by_type) == 1:
                merged_genes.append(genes_by_type[0])
            elif len(genes_by_type) == 2:
                gene1 = genes_by_type[0]
                gene2 = genes_by_type[1]
                merged_genes.append(gene1.merge(gene2))
            else:
                raise Exception('invalid genes count')
            
        for gene in merged_genes:
            gene.affect(phenotype)

        return phenotype
    
    def get_avaliable_ant_types(self):
        res = []

        if self._paternal is None:
            if self._check_gene_presence(GenesTypes.DEVELOPMENT_MALE_CASTE):
                res.append(AntTypes.MALE)
        else:
            if self._check_gene_presence(GenesTypes.DEVELOPMENT_WORKER_CASTE):
                res.append(AntTypes.WORKER)

            if self._check_gene_presence(GenesTypes.DEVELOPMENT_QUEEN_CASTE):
                res.append(AntTypes.QUEEN)

            if self._check_gene_presence(GenesTypes.DEVELOPMENT_WARRIOR_CASTE):
                res.append(AntTypes.WARRIOR)

        return res

    def _check_gene_presence(self, gene_type: GenesTypes):
        is_in_maternal = self._maternal.development_chromosome.has_gene(gene_type)
        is_in_paternal = self._paternal.development_chromosome.has_gene(gene_type) if self._paternal is not None else False
        return is_in_maternal or is_in_paternal
    