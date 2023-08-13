from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.utils.point import Point

from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from core.world.entities.ground_beetle.ground_beetle_mind import GroundBeetleMind
from core.world.entities.ground_beetle.ground_beetle_body import GroundBeetleBody

class GroundBeetleFactory():

    def __init__(self, thought_factory: ThoughtFactory):
        self._thought_factory = thought_factory

    def build_ground_beetle(self, id: int, from_colony_id: int, dna_profile: str, position: Point, hp: int, memory_data: dict, is_auto_thought_generation: bool):
        events = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        hp = hp if hp else GroundBeetle.MAX_HP
        body = GroundBeetleBody(events, memory, dna_profile, position, hp, world_interactor)
        mind = GroundBeetleMind(events, body, self._thought_factory, is_auto_thought_generation)

        return GroundBeetle(events, id, from_colony_id, mind, body)
