from core.world.utils.event_emiter import EventEmitter
from core.world.utils.size import Size
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from .map import Map
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.nest.nest_factory import NestFactory

class MapFactory():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory, food_factory: FoodFactory, nest_factory: NestFactory):
        self._event_bus = event_bus
        self._ant_factory = ant_factory
        self._food_factory = food_factory
        self._nest_factory = nest_factory

    def build_map(self, size: Size, id_generator: IdGenerator, entities_collection: EntityCollection):
        return Map(self._event_bus, size, entities_collection, id_generator, self._ant_factory, self._food_factory, self._nest_factory)