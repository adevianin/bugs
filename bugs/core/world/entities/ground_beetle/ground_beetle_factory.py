from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.visual_sensor import VisualSensor
from core.world.entities.base.live_entity.temperature_sensor import TemperatureSensor
from core.world.utils.point import Point
from core.world.settings import GROUND_BEETLE_COLONY_ID
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from core.world.entities.ground_beetle.ground_beetle_mind import GroundBeetleMind
from core.world.entities.ground_beetle.ground_beetle_body import GroundBeetleBody
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig

class GroundBeetleFactory():

    def __init__(self, event_bus: EventEmitter, thought_factory: ThoughtFactory):
        self._event_bus = event_bus
        self._thought_factory = thought_factory

    def build_new_ground_beetle(self, id: int, position: Point, birth_step: int):
        ownership = OwnershipConfig(GROUND_BEETLE_COLONY_ID, None) 
        hp = StatsLibrary.GROUND_BEETLE_DEFAULT.max_hp
        return self.build_ground_beetle(id=id, ownership=ownership, position=position, angle=0, hp=hp, memory=Memory(), 
                                        is_auto_thought_generation=True, birth_step=birth_step)

    def build_ground_beetle(self, id: int, ownership: OwnershipConfig, position: Point, angle: int, hp: int, birth_step: int, memory: Memory, 
                            is_auto_thought_generation: bool):
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        stats = StatsLibrary.GROUND_BEETLE_DEFAULT
        body = GroundBeetleBody(EventEmitter(), stats, memory, position, angle, hp, birth_step, visual_sensor, temperature_sensor)
        mind = GroundBeetleMind(body, self._thought_factory, is_auto_thought_generation)

        return GroundBeetle(self._event_bus, EventEmitter(), id, ownership, body, mind)
