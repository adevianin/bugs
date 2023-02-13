from .world_data_repository_interface import iWorldDataRepository
from .utils.event_emiter import EventEmitter
from .entities.bug.bug_factory import BugFactory
from .entities.food.food_factory import FoodFactory
from .world_factory import WorldFactory
from .world import World
from .entities.base.live_entity.action.action_builder import ActionBuilder
from .settings import STEP_TIME

from typing import Callable

class WorldFacade:
    _instance = None

    @classmethod
    def init(cls, data_repository: iWorldDataRepository):
        WorldFacade._instance = WorldFacade(data_repository)
        return WorldFacade._instance

    @classmethod
    def get_instance(cls):
        return WorldFacade._instance

    def __init__(self, data_repository: iWorldDataRepository):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self
        
        self._data_repository = data_repository
        self._world: World

    def init_world(self):
        world_data = self._data_repository.get()

        self._event_bus = EventEmitter()

        action_builder = ActionBuilder(STEP_TIME)

        bug_factory = BugFactory(self._event_bus, action_builder)
        food_factory = FoodFactory(self._event_bus)
        world_factory = WorldFactory(self._event_bus, bug_factory, food_factory)

        self._world = world_factory.build_world_from_json(world_data)
        self._world.set_step_time(STEP_TIME)
        self._world.run()

    def get_world_json(self):
        return self._world.to_json()

    def stop(self):
        self._world.stop()

    def add_listener(self, event_name: str, callback: Callable):
        self._event_bus.add_listener(event_name, callback)

    def remove_listener(self, event_name: str, callback: Callable):
        self._event_bus.remove_listener(event_name, callback)
        