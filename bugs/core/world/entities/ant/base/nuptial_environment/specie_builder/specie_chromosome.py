from .specie_gene import SpecieGene
from core.world.entities.ant.base.genetic.chromosome import Chromosome
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from typing import List

class SpecieChromosome():

    @classmethod
    def build(self, type: ChromosomeTypes, activated_specie_genes_ids: List[str], specie_genes: List[SpecieGene]):
        return SpecieChromosome(type, activated_specie_genes_ids, specie_genes)

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
    
    def accept_chromosome(self, chromosome: Chromosome):
        for gene in chromosome.genes:
            specie_gene = SpecieGene.build_new(gene)
            self._specie_genes.append(specie_gene)
    
    def generate_chromosome(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> Chromosome:
        activated_genes = self._get_activated_specie_genes()
        generated_genes = []
        for specie_gene in activated_genes:
            generated_genes.append(specie_gene.generate_gene(percent, super_mutate_chance, super_mutate_percent))

        return Chromosome.build(self.type, generated_genes)
    
    def get_specie_gene_by_id(self, id: str):  
        for specie_gene in self._specie_genes:
            if specie_gene.id == id:
                return specie_gene
            
        return None
    
    def _get_activated_specie_genes(self) -> List[SpecieGene]:
        activated_genes = []
        for specie_gene in self._specie_genes:
            if specie_gene.id in self._activated_specie_genes_ids:
                activated_genes.append(specie_gene)

        return activated_genes
    