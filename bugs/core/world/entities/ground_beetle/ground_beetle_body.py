from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.nest.nest import Nest
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.live_entity.body import Body
from core.world.entities.food.food_source import FoodSource
from core.world.entities.food.food_types import FoodTypes

class GroundBeetleBody(Body):

    DISTANCE_PER_SEP = 32
    SIGHT_DISTANCE = 200

    def __init__(self, events: EventEmitter, memory: Memory, dna_profile: str, position: Point, hp: int, world_interactor: WorldInteractor):
        super().__init__(events, memory, dna_profile, position, hp, world_interactor)

    def eat_aphid(self, food_source: FoodSource):
        if food_source.food_type != FoodTypes.HONEYDEW:
            raise Exception('is is not aphid')
        
        food_source.damage_fertility(10)