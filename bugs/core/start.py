from core.data.repositories.world_data_repository import WorldDataRepository
from core.data.repositories.world_repository import WorldRepository
from core.data.factories.json_nest_factory import JsonNestFactory
from core.data.factories.json_ant_factory import JsonAntFactory
from core.data.factories.json_colony_factory import JsonColonyFactory
from core.data.factories.json_thought_factory import JsonThoughtFactory
from core.data.serializers.larva_serializer import LarvaSerializer
from core.data.serializers.nest_serializer import NestSerializer
from core.data.serializers.world_serializer import WorldSerializer
from core.data.serializers.ant_serializer import AntSerializer
from core.data.serializers.thought_serializer import ThoughtSerializer
from core.data.serializers.colony_serializer import ColonySerializer
from core.data.serializers.operation_serializer import OperationSerializer
from core.data.factories.json_operation_factory import JsonOperationFactory
from core.data.factories.json_map_factory import JsonMapFactory
from core.data.serializers.colony_relations_table_serializer import ColonyRelationsTableSerializer
from core.data.serializers.ground_beetle_serializer import GroundBeetleSerializer
from core.data.factories.json_ground_beetle_factory import JsonGroundBeetleFactory
from core.data.factories.json_item_factory import JsonItemFactory
from core.data.factories.json_item_source_factory import JsonItemSourceFactory
from core.data.factories.json_item_area_factory import JsonItemAreaFactory
from core.data.serializers.item_serializer import ItemSerializer
from core.data.serializers.item_area_serializer import ItemAreaSerializer
from core.data.serializers.item_source_serializer import ItemSourceSerializer

from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory
from core.world.entities.world.world_factory import WorldFactory
from core.world.services.nest_service import NestService
from core.world.entities.nest.nest_factory import NestFactory
from core.world.services.colony_service import ColonyService
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.operation.operation_factory import OperationFactory
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.world_facade import WorldFacade
from core.world.entities.map.map_factory import MapFactory
from core.world.services.user_service import UserService
from core.world.entities.colony.formation.formation_factory import FormationFactory
from core.world.entities.items.item_factory import ItemFactory
from core.world.entities.items.item_source_factory import ItemSourceFactory
from core.world.entities.items.item_area_factory import ItemAreaFactory

def start():
    event_bus = EventEmitter()

    item_factory = ItemFactory()
    item_source_factory = ItemSourceFactory()
    item_area_factory = ItemAreaFactory()
    formation_factory = FormationFactory(event_bus)
    thought_factory = ThoughtFactory()
    ant_factory = AntFactory(thought_factory)
    ground_beetle_factory = GroundBeetleFactory(thought_factory)
    nest_factory = NestFactory()
    colony_factory = ColonyFactory(event_bus)
    operation_factory = OperationFactory(formation_factory)
    map_factory = MapFactory(event_bus)
    world_factory = WorldFactory(event_bus, ant_factory, item_factory, nest_factory, ground_beetle_factory)
    
    colony_service = ColonyService(operation_factory)
    nest_service = NestService()
    user_service = UserService(colony_factory, ant_factory)

    larva_serializer = LarvaSerializer()
    nest_serializer = NestSerializer(larva_serializer)
    thought_serializer = ThoughtSerializer()
    ant_serializer = AntSerializer(thought_serializer)
    operation_serializer = OperationSerializer()
    colony_serializer = ColonySerializer(operation_serializer)
    colony_relations_table_serializer = ColonyRelationsTableSerializer()
    ground_beetle_serializer = GroundBeetleSerializer(thought_serializer)
    item_serializer = ItemSerializer()
    item_area_serializer = ItemAreaSerializer()
    item_source_serializer = ItemSourceSerializer()
    world_serializer = WorldSerializer(nest_serializer, ant_serializer, item_serializer, item_area_serializer, item_source_serializer, colony_serializer, colony_relations_table_serializer, ground_beetle_serializer)

    world_data_repository = WorldDataRepository()
    json_nest_factory = JsonNestFactory(nest_factory)
    json_ant_factory = JsonAntFactory(ant_factory)
    json_ground_beetle_factory = JsonGroundBeetleFactory(ground_beetle_factory)
    json_operation_factory = JsonOperationFactory(operation_factory)
    json_map_factory = JsonMapFactory(map_factory)
    json_colony_factory = JsonColonyFactory(colony_factory, json_operation_factory)
    json_thought_factory = JsonThoughtFactory(thought_factory)
    json_item_factory = JsonItemFactory(item_factory)
    json_item_source_factory = JsonItemSourceFactory(item_source_factory)
    json_item_area_factory = JsonItemAreaFactory(item_area_factory)
    world_repository = WorldRepository(world_data_repository, json_nest_factory, json_ant_factory, json_colony_factory, json_thought_factory, json_map_factory, world_factory, json_ground_beetle_factory, json_item_factory, json_item_source_factory, json_item_area_factory, world_serializer)

    world_facade = WorldFacade.init(event_bus, world_repository, colony_service, nest_service, user_service)

    world_facade.init_world()

    colony_service.set_world(world_facade.world)
    nest_service.set_world(world_facade.world)
    user_service.set_world(world_facade.world)

    world_facade.world.run()