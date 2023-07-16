from core.world.entities.ant.base.larva import Larva
from typing import List
from core.world.entities.ant.base.larva import Larva

class LarvaSerializer():

    def serialize_larva(self, larva: Larva):
        json = {}
        json.update({
            'ant_type': larva.ant_type,
            'ate_calories': larva.ate_calories,
            'dna_profile': larva.dna_profile
        })

        return json
    
    def serialize_larvae(self, larvae: List[Larva]):
        json = []

        for larva in larvae:
            json.append(self.serialize_larva(larva))
    
        return json