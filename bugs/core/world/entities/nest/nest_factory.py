from core.world.utils.point import Point
from .nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.larva import Larva
from core.world.utils.event_emiter import EventEmitter
from core.world.id_generator import IdGenerator

class NestFactory():

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator):
        self._event_bus = event_bus
        self._id_generator = id_generator

    def build_new_nest(self,  position: Point, from_colony: int):
        return Nest(self._event_bus, self._id_generator.generate_id(), position, 'red', from_colony, [], 1)

    def build_nest(self, id: int, position: Point, color: str, from_colony: int, larvae: list, larva_places: int) -> Nest:
        larvae = self._build_larvae_at(larvae, position)
        return Nest(self._event_bus, id, position, color, from_colony, larvae, larva_places)
    
    def _build_larvae_at(self, larvae_data: list, position: Point):
        larvae = []
        for larva_data in larvae_data:
            larva = Larva.build_larva(position, AntTypes(larva_data['type']), larva_data['dna_profile'], larva_data['ate_calories'])
            larvae.append(larva)

        return larvae
