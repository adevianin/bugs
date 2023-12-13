from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.item.items.base.item import Item
from core.world.entities.nest.nest import Nest
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from ..base.ant_body import AntBody
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.larva import Larva
from .genes import Genes

class QueenAntBody(AntBody):

    def __init__(self, events: EventEmitter, stats: LiveStats, sayer: EventEmitter, memory: Memory, position: Point, angle: int, hp: int, located_in_nest: Nest, picked_item: Item, world_interactor: WorldInteractor, genes: Genes):
        super().__init__(events, stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor)
        self._genes = genes

    def produce_larva(self, ant_type: AntTypes) -> Larva:
        match(ant_type):
            case AntTypes.WORKER:
                return Larva.build_new(ant_type, self._genes.worker_food_required, self._genes.get_worker_stats())
            case AntTypes.WARRIOR:
                return Larva.build_new(ant_type, self._genes.warrior_food_required, self._genes.get_warrior_stats())
            case AntTypes.QUEEN:
                return Larva.build_new(ant_type, self._genes.queen_food_required, self._genes.get_queen_stats())
    