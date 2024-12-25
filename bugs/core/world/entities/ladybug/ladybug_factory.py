from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.visual_sensor import VisualSensor
from core.world.entities.base.live_entity.temperature_sensor import TemperatureSensor
from core.world.utils.point import Point
from core.world.settings import LADYBUG_COLONY_ID
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig
from .ladybug_body import LadybugBody
from .ladybug_mind import LadybugMind
from .ladybug import Ladybug
from core.world.entities.world.id_generator import IdGenerator

class LadybugFactory():

    def __init__(self, event_bus: EventEmitter, thought_factory: ThoughtFactory):
        self._event_bus = event_bus
        self._thought_factory = thought_factory

    def build_new_ladybug(self, position: Point, birth_step: int):
        id = IdGenerator.generate_id()
        ownership = OwnershipConfig(LADYBUG_COLONY_ID, None) 
        ladybug = self.build_ladybug(id=id, ownership=ownership, position=position, angle=0, hp=0, memory=Memory(), is_auto_thought_generation=True, birth_step=birth_step, calories=0)
        ladybug.born()
        return ladybug

    def build_ladybug(self, id: int, ownership: OwnershipConfig, position: Point, angle: int, hp: int, birth_step: int, calories: int, memory: Memory, 
                            is_auto_thought_generation: bool):
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        stats = StatsLibrary.LADYBUG_DEFAULT
        body = LadybugBody(EventEmitter(), stats, memory, position, angle, hp, birth_step, calories, visual_sensor, temperature_sensor)
        mind = LadybugMind(body, self._thought_factory, is_auto_thought_generation)

        return Ladybug(self._event_bus, EventEmitter(), id, ownership, body, mind)
