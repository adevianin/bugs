from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.utils.point import Point
from core.world.settings import GROUND_BEETLE_COLONY_ID
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from core.world.entities.ground_beetle.ground_beetle_mind import GroundBeetleMind
from core.world.entities.ground_beetle.ground_beetle_body import GroundBeetleBody
from core.world.entities.base.stats_library import StatsLibrary

class GroundBeetleFactory():

    def __init__(self, thought_factory: ThoughtFactory):
        self._thought_factory = thought_factory

    def build_new_ground_beetle(self, id: int, position: Point):
        return self.build_ground_beetle(id=id, from_colony_id=GROUND_BEETLE_COLONY_ID, position=position, angle=0, hp=None, memory_data={}, is_auto_thought_generation=True)

    def build_ground_beetle(self, id: int, from_colony_id: int, position: Point, angle: int, hp: int, memory_data: dict, is_auto_thought_generation: bool):
        events = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        stats = StatsLibrary.GROUND_BEETLE_DEFAULT
        hp = hp or stats.max_hp
        body = GroundBeetleBody(events, stats, memory, position, angle, hp, world_interactor)
        mind = GroundBeetleMind(events, body, self._thought_factory, is_auto_thought_generation)

        return GroundBeetle(events, id, from_colony_id, body, mind)
