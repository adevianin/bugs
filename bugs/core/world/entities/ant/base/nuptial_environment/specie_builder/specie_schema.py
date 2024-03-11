from typing import List

class SpecieSchema():

    @classmethod
    def build(cls, body_schema: List[str], development_schema: List[str], adaptation_schema: List[str], building_schema: List[str], combat_schema: List[str], adjusting_schema: List[str]):
        return SpecieSchema(body_schema, development_schema, adaptation_schema, building_schema, combat_schema, adjusting_schema)

    def __init__(self, body_schema: List[str], development_schema: List[str], adaptation_schema: List[str], building_schema: List[str], combat_schema: List[str], adjusting_schema: List[str]):
        self.body_schema = body_schema
        self.development_schema = development_schema
        self.adaptation_schema = adaptation_schema
        self.building_schema = building_schema
        self.combat_schema = combat_schema
        self.adjusting_schema = adjusting_schema

    def get_used_genes_codes(self):
        pass