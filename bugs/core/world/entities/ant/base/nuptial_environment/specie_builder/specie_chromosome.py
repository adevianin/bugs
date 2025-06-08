from .specie_gene import SpecieGene
from core.world.entities.ant.base.genetic.chromosome import Chromosome
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from .required_genes_list import REQUIRED_GENES
from typing import List
import random

class SpecieChromosome():

    @classmethod
    def build(self, type: ChromosomeTypes, activated_specie_genes_ids: List[str], specie_genes: List[SpecieGene]):
        return SpecieChromosome(type, activated_specie_genes_ids, specie_genes)
    
    @staticmethod
    def build_new(chromosome: Chromosome) -> 'SpecieChromosome':
        specie_genes = [SpecieGene.build_new(gene) for gene in chromosome.genes]
        activated_specie_genes_ids = [specie_gene.id for specie_gene in specie_genes]
        return SpecieChromosome(chromosome.type, activated_specie_genes_ids, specie_genes)

    def __init__(self, type: ChromosomeTypes, activated_specie_genes_ids: List[str], specie_genes: List[SpecieGene]):
        self._type = type
        self._activated_specie_genes_ids = activated_specie_genes_ids
        self._specie_genes = specie_genes

    @property
    def activated_specie_genes_ids(self) -> List[str]:
        return self._activated_specie_genes_ids

    @property
    def specie_genes(self) -> List[SpecieGene]:
        return self._specie_genes
    
    @property
    def type(self):
        return self._type
    
    def clear_not_activated_specie_genes(self):
        not_activated_genes = []
        for specie_gene in self._specie_genes:
            if specie_gene.id not in self._activated_specie_genes_ids:
                not_activated_genes.append(specie_gene)

        for specie_gene in not_activated_genes:
            self._specie_genes.remove(specie_gene)
    
    def apply_schema(self, ids: List[str]):
        self._activated_specie_genes_ids = ids
    
    def accept_chromosome(self, chromosome: Chromosome):
        for gene in chromosome.genes:
            if random.random() < 0.2:
                continue
            specie_gene = SpecieGene.build_new(gene)
            self._specie_genes.append(specie_gene)
    
    def generate_chromosome(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> Chromosome:
        activated_genes = self._get_activated_specie_genes()
        generated_genes = []
        for specie_gene in activated_genes:
            generated_gene = specie_gene.generate_gene(percent, super_mutate_chance, super_mutate_percent)
            generated_genes.append(generated_gene)

        return Chromosome.build(self.type, generated_genes)
    
    def get_specie_gene_by_id(self, id: str) -> SpecieGene:  
        for specie_gene in self._specie_genes:
            if specie_gene.id == id:
                return specie_gene
            
        return None
    
    def validate_schema(self, validating_ids: List[str]) -> bool:
        validating_genes_types = []
        for id in validating_ids:
            specie_gene = self.get_specie_gene_by_id(id)

            if not specie_gene:
                return False
            
            type = specie_gene.gene.type
            if type in validating_genes_types:
                return False
            
            validating_genes_types.append(type)

        for gene_type in REQUIRED_GENES[self._type]:
            if gene_type not in validating_genes_types:
                return False

        return True
    
    def check_gene_presence(self, gene_type: GenesTypes):
        for specie_gene in self._specie_genes:
            if specie_gene.gene.type == gene_type:
                return True
        
        return False
    
    def get_activated_specie_gene_by_type(self, gene_type: GenesTypes):
        for specie_gene in self._specie_genes:
            if specie_gene.gene.type == gene_type and specie_gene.id in self._activated_specie_genes_ids:
                return specie_gene
        
        return None
    
    def _get_activated_specie_genes(self) -> List[SpecieGene]:
        activated_genes = []
        for specie_gene in self._specie_genes:
            if specie_gene.id in self._activated_specie_genes_ids:
                activated_genes.append(specie_gene)

        return activated_genes
    