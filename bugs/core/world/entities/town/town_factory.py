from core.world.utils.point import Point
from .town import Town
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.larva import Larva
from core.world.utils.event_emiter import EventEmitter

class TownFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_town(self,  position: Point, owner_id: int):
        return Town(self._event_bus, -1, position, 'red', owner_id, [], 1)

    def build_town(self, id: int, position: Point, color: str, owner_id: int, larvae: list, larva_places: int) -> Town:
        larvae = self._build_larvae_at(larvae, position)
        return Town(self._event_bus, id, position, color, owner_id, larvae, larva_places)
    
    def _build_larvae_at(self, larvae_data: list, position: Point):
        larvae = []
        for larva_data in larvae_data:
            larva = Larva.build_larva(position, AntTypes(larva_data['type']), larva_data['dna_profile'], larva_data['ate_calories'])
            larvae.append(larva)

        return larvae
