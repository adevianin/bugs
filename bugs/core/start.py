from core.data.repositories.world_data_repository import WorldDataRepository
from core.data.repositories.world_repository import WorldRepository
from core.data.factories.json_nest_factory import JsonNestFactory
from core.data.factories.json_ant_factory import JsonAntFactory
from core.data.factories.json_food_factory import JsonFoodFactory
from core.data.factories.json_colony_factory import JsonColonyFactory
from core.data.factories.json_thought_factory import JsonThoughtFactory
from core.data.factories.json_memory_factory import JsonMemoryFactory
from core.data.serializers.larva_serializer import LarvaSerializer
from core.data.serializers.nest_serializer import NestSerializer
from core.data.serializers.world_serializer import WorldSerializer
from core.data.serializers.ant_serializer import AntSerializer
from core.data.serializers.thought_serializer import ThoughtSerializer
from core.data.serializers.food_serializer import FoodSerializer
from core.data.serializers.food_area_serializer import FoodAreaSerializer
from core.data.serializers.colony_serializer import ColonySerializer
from core.data.serializers.operation_serializer import OperationSerializer
from core.data.factories.json_operation_factory import JsonOperationFactory
from core.data.factories.json_map_factory import JsonMapFactory

from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.world.world_factory import WorldFactory
from core.world.services.nest_service import NestService
from core.world.entities.nest.nest_factory import NestFactory
from core.world.services.colony_service import ColonyService
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.operation.operation_factory import OperationFactory
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.world_facade import WorldFacade
from core.world.entities.map.map_factory import MapFactory

def start():
    event_bus = EventEmitter()

    thought_factory = ThoughtFactory()
    ant_factory = AntFactory(thought_factory)
    nest_factory = NestFactory()
    food_factory = FoodFactory()
    colony_factory = ColonyFactory(event_bus)
    operation_factory = OperationFactory()
    map_factory = MapFactory(event_bus, ant_factory, food_factory, nest_factory)
    world_factory = WorldFactory(event_bus)
    
    colony_service = ColonyService(operation_factory)
    nest_service = NestService()

    larva_serializer = LarvaSerializer()
    nest_serializer = NestSerializer(larva_serializer)
    thought_serializer = ThoughtSerializer()
    ant_serializer = AntSerializer(thought_serializer)
    food_serializer = FoodSerializer()
    food_area_serializer = FoodAreaSerializer()
    operation_serializer = OperationSerializer()
    colony_serializer = ColonySerializer(operation_serializer)
    world_serializer = WorldSerializer(nest_serializer, ant_serializer, food_serializer, food_area_serializer, colony_serializer)

    world_data_repository = WorldDataRepository()
    json_nest_factory = JsonNestFactory(nest_factory)
    json_memory_factory = JsonMemoryFactory()
    json_ant_factory = JsonAntFactory(ant_factory, json_memory_factory)
    json_food_factory = JsonFoodFactory(food_factory)
    json_operation_factory = JsonOperationFactory(operation_factory)
    json_map_factory = JsonMapFactory(map_factory)
    json_colony_factory = JsonColonyFactory(colony_factory, json_operation_factory)
    json_thought_factory = JsonThoughtFactory(thought_factory)
    world_repository = WorldRepository(world_data_repository, json_nest_factory, json_ant_factory, json_food_factory, json_colony_factory, json_thought_factory, json_map_factory, world_factory, world_serializer)

    world_facade = WorldFacade.init(event_bus, world_repository, colony_service, nest_service)

    world_facade.init_world()

    colony_service.set_world(world_facade.world)
    nest_service.set_world(world_facade.world)

    world_facade.world.run()