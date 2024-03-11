from .specie_schema import SpecieSchema
from .gene_entry import GeneEntry
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.chromosome import Chromosome
from core.world.entities.ant.base.genetic.genome import Genome

from typing import List
import uuid

class SpecieBuilder():

    @classmethod
    def build(cls, schema: SpecieSchema, genes_entries: List[GeneEntry]):
        return SpecieBuilder(schema, genes_entries)

    def __init__(self, schema: SpecieSchema, genes_entries: List[GeneEntry]):
        self._schema = schema
        self._genes_entries = genes_entries

    @property
    def schema(self) -> SpecieSchema:
        return self._schema
    
    @property
    def genes_entries(self) -> List[GeneEntry]:
        return self._genes_entries

    def add_new_gene(self, gene: BaseGene):
        id = uuid.uuid4().hex
        self._genes_entries.append(GeneEntry.build(id, gene))

    def build_male_genome(self) -> Genome:
        return Genome.build(self._build_chromosome_set(), None)

    def _build_chromosome_set(self) -> ChromosomesSet:
        body_chromosome = self._build_chromosome(self._schema.body_schema)
        development_chromosome = self._build_chromosome(self._schema.development_schema)
        adaptation_chromosome = self._build_chromosome(self._schema.adaptation_schema)
        building_chromosome = self._build_chromosome(self._schema.building_schema)
        combat_chromosome = self._build_chromosome(self._schema.combat_schema)
        adjusting_chromosome = self._build_chromosome(self._schema.adjusting_schema)
        return ChromosomesSet.build(body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)

    def _build_chromosome(self, chromosome_schema: List[str]) -> Chromosome:
        genes = []
        for gene_id in chromosome_schema:
            genes.append(self._get_gene_by_id(gene_id))
            
        return Chromosome.build(genes)
    
    def _get_gene_by_id(self, gene_id: str) -> BaseGene:
        for gene_entry in self._genes_entries:
            if gene_entry.id == gene_id:
                return gene_entry.gene
        
        return None
