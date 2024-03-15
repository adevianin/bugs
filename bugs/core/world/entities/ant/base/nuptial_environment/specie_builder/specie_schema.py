from typing import List

class SpecieSchema():

    @classmethod
    def build(self, body: List[str], development: List[str], adaptation: List[str], building: List[str], combat: List[str], adjusting: List[str]):
        return SpecieSchema(body, development, adaptation, building, combat, adjusting)

    def __init__(self, body: List[str], development: List[str], adaptation: List[str], building: List[str], combat: List[str], adjusting: List[str]):
        self.body_schema = body
        self.development_schema = development
        self.adaptation_schema = adaptation
        self.building_schema = building
        self.combat_schema = combat
        self.adjusting_schema = adjusting