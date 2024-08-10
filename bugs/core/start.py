from core.data.repositories.world_data_repository import WorldDataRepository
from core.data.repositories.world_repository import WorldRepository

from core.data.deserializers.nest_deserializer import NestDeserializer
from core.data.deserializers.ant_deserializer import AntDeserializer
from core.data.deserializers.colony_deserializer import ColonyDeserializer
from core.data.deserializers.thought_deserializer import ThoughtDeserializer
from core.data.deserializers.operation_deserializer import OperationDeserializer
from core.data.deserializers.ground_beetle_deserializer import GroundBeetleDeserializer
from core.data.deserializers.item_source_deserializer import ItemSourceDeserializer
from core.data.deserializers.item_area_deserializer import ItemAreaDeserializer
from core.data.deserializers.formation_deserializer import FormationDeserializer
from core.data.deserializers.item_deserializer import ItemDeserializer
from core.data.deserializers.map_deserializer import MapDeserializer
from core.data.deserializers.gene_deserializer import GeneDeserializer
from core.data.deserializers.larva_deserializer import LarvaDeserializer
from core.data.deserializers.egg_deserializer import EggDeserializer
from core.data.deserializers.nuptial_environment_deserializer import NuptialEnvironmentDeserializer
from core.data.deserializers.genome_deserializer import GenomeDeserializer
from core.data.deserializers.climate_deserializer import ClimateDeserializer

from core.data.serializers.larva_serializer import LarvaSerializer
from core.data.serializers.egg_serializer import EggSerializer
from core.data.serializers.nest_serializer import NestSerializer
from core.data.serializers.world_serializer import WorldSerializer
from core.data.serializers.ant_serializer import AntSerializer
from core.data.serializers.thought_serializer import ThoughtSerializer
from core.data.serializers.colony_serializer import ColonySerializer
from core.data.serializers.operation_serializer import OperationSerializer
from core.data.serializers.colony_relations_table_serializer import ColonyRelationsTableSerializer
from core.data.serializers.ground_beetle_serializer import GroundBeetleSerializer
from core.data.serializers.item_serializer import ItemSerializer
from core.data.serializers.item_area_serializer import ItemAreaSerializer
from core.data.serializers.item_source_serializer import ItemSourceSerializer
from core.data.serializers.formation_serializer import FormationSerializer
from core.data.serializers.genes_serializer import GenesSerializer
from core.data.serializers.nuptial_environment_serializer import NuptialEnvironmentSerializer
from core.data.serializers.genome_serializer import GenomeSerializer
from core.data.serializers.climate_serializer import ClimateSerializer

from core.world.world_facade import WorldFacade
from core.world.utils.event_emiter import EventEmitter

from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory
from core.world.entities.world.world_factory import WorldFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.map.map_factory import MapFactory
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.entities.item.items.item_factory import ItemFactory
from core.world.entities.item.item_sources.item_source_factory import ItemSourceFactory
from core.world.entities.item.item_areas.item_area_factory import ItemAreaFactory
from core.world.entities.climate.climate_factory import ClimateFactory

from core.world.services.player_service import PlayerService
from core.world.services.colony_service import ColonyService
from core.world.services.nuptial_environment_service import NuptialEnvironmentService
from core.world.services.ant_service import AntService

from core.sync.world_client_serializer import WorldClientSerializer
from core.sync.colony_client_serializer import ColonyClientSerializer
from core.sync.operation_client_serializer import OperationClientSerializer
from core.sync.util_client_serializer import UtilClientSerializer
from core.sync.larva_client_serializer import LarvaClientSerializer
from core.sync.egg_client_serializer import EggClientSerializer
from core.sync.stats_client_serializer import StatsClientSerializer
from core.sync.item_client_serializer import ItemClientSerializer
from core.sync.item_source_client_serializer import ItemSourceClientSerializer
from core.sync.item_area_client_serializer import ItemAreaClientSerializer
from core.sync.nest_client_serializer import NestClientSerializer
from core.sync.ground_beetle_client_serializer import GroundBeetleClientSerializer
from core.sync.ant_client_serializer import AntClientSerializer
from core.sync.action_client_serializer import ActionClientSerializer
from core.sync.entity_client_serializer import EntityClientSerializer
from core.sync.genes_client_serializer import GenesClientSerializer
from core.sync.genome_client_serializer import GenomeClientSerializer
from core.sync.nuptial_environment_client_serializer import NuptialEnvironmentClientSerializer
from core.sync.climate_client_serializer import ClimateClientSerializer

def start():
    event_bus = EventEmitter()

    item_factory = ItemFactory(event_bus)
    item_source_factory = ItemSourceFactory(event_bus)
    item_area_factory = ItemAreaFactory(event_bus)
    formation_factory = FormationFactory(event_bus)
    thought_factory = ThoughtFactory()
    ant_factory = AntFactory(event_bus, thought_factory)
    ground_beetle_factory = GroundBeetleFactory(event_bus, thought_factory)
    nest_factory = NestFactory(event_bus)
    operation_factory = OperationFactory(formation_factory)
    colony_factory = ColonyFactory(event_bus, operation_factory)
    map_factory = MapFactory(event_bus)
    climate_factory = ClimateFactory(event_bus)
    world_factory = WorldFactory(event_bus, ant_factory, item_factory, nest_factory, ground_beetle_factory)
    
    colony_service = ColonyService(operation_factory)
    player_service = PlayerService(colony_factory, ant_factory)
    nuptial_environment_service = NuptialEnvironmentService(colony_factory)
    ant_service = AntService()

    genes_serializer = GenesSerializer()
    genome_serializer = GenomeSerializer(genes_serializer)
    larva_serializer = LarvaSerializer(genome_serializer)
    egg_serializer = EggSerializer(genome_serializer)
    nest_serializer = NestSerializer(larva_serializer, egg_serializer)
    thought_serializer = ThoughtSerializer()
    ant_serializer = AntSerializer(thought_serializer, genome_serializer)
    formation_serializer = FormationSerializer()
    operation_serializer = OperationSerializer(formation_serializer)
    colony_serializer = ColonySerializer(operation_serializer)
    colony_relations_table_serializer = ColonyRelationsTableSerializer()
    ground_beetle_serializer = GroundBeetleSerializer(thought_serializer)
    item_serializer = ItemSerializer()
    item_area_serializer = ItemAreaSerializer()
    item_source_serializer = ItemSourceSerializer()
    nuptial_environment_serializer = NuptialEnvironmentSerializer(genes_serializer)
    climate_serializer = ClimateSerializer()
    world_serializer = WorldSerializer(nest_serializer, ant_serializer, item_serializer, item_area_serializer, item_source_serializer, colony_serializer, 
                                       colony_relations_table_serializer, ground_beetle_serializer, nuptial_environment_serializer, climate_serializer)

    world_data_repository = WorldDataRepository()
    gene_deserializer = GeneDeserializer()
    genome_deserializer = GenomeDeserializer(gene_deserializer)
    larva_deserializer = LarvaDeserializer(genome_deserializer)
    egg_deserializer = EggDeserializer(genome_deserializer)
    nest_deserializer = NestDeserializer(larva_deserializer, egg_deserializer, nest_factory)
    ant_deserializer = AntDeserializer(genome_deserializer, ant_factory)
    ground_beetle_deserializer = GroundBeetleDeserializer(ground_beetle_factory)
    formation_deserializer = FormationDeserializer(formation_factory)
    operation_deserializer = OperationDeserializer(operation_factory, formation_deserializer)
    map_deserializer = MapDeserializer(map_factory)
    colony_deserializer = ColonyDeserializer(colony_factory, operation_deserializer)
    thought_deserializer = ThoughtDeserializer(thought_factory)
    item_deserializer = ItemDeserializer(item_factory)
    item_source_deserializer = ItemSourceDeserializer(item_source_factory)
    item_area_deserializer = ItemAreaDeserializer(item_area_factory)
    nuptial_environment_deserializer = NuptialEnvironmentDeserializer(gene_deserializer)
    climate_deserializer = ClimateDeserializer(climate_factory)
    world_repository = WorldRepository(world_data_repository, nest_deserializer, ant_deserializer, colony_deserializer, thought_deserializer, map_deserializer, world_factory, 
                                       ground_beetle_deserializer, item_deserializer, item_source_deserializer, item_area_deserializer, nuptial_environment_deserializer, climate_deserializer,
                                        world_serializer)

    stats_client_serializer = StatsClientSerializer()
    genes_client_serializer = GenesClientSerializer()
    genome_client_serializer = GenomeClientSerializer(genes_client_serializer)
    larva_client_serializer = LarvaClientSerializer(genome_client_serializer)
    egg_client_serializer = EggClientSerializer(genome_client_serializer)
    util_client_serializer = UtilClientSerializer()
    operation_client_serializer = OperationClientSerializer()
    colony_client_serializer = ColonyClientSerializer(operation_client_serializer)
    item_client_serializer = ItemClientSerializer(util_client_serializer)
    item_source_client_serializer = ItemSourceClientSerializer(util_client_serializer)
    item_area_client_serializer = ItemAreaClientSerializer(util_client_serializer)
    nest_client_serializer = NestClientSerializer(util_client_serializer, larva_client_serializer, egg_client_serializer)
    ground_beetle_client_serializer = GroundBeetleClientSerializer(util_client_serializer)
    ant_client_serializer = AntClientSerializer(util_client_serializer, stats_client_serializer, genome_client_serializer)
    entity_client_serializer = EntityClientSerializer(item_client_serializer, item_source_client_serializer, item_area_client_serializer, nest_client_serializer, 
                                                      ground_beetle_client_serializer, ant_client_serializer)
    climate_client_serializer = ClimateClientSerializer()
    world_client_serializer = WorldClientSerializer(colony_client_serializer, entity_client_serializer, climate_client_serializer)
    action_client_serializer = ActionClientSerializer(entity_client_serializer, util_client_serializer, larva_client_serializer, egg_client_serializer, colony_client_serializer, 
                                                      operation_client_serializer)
    nuptial_environment_client_serializer = NuptialEnvironmentClientSerializer(genome_client_serializer, genes_client_serializer, stats_client_serializer)

    world_facade = WorldFacade.init(event_bus, world_client_serializer, action_client_serializer, nuptial_environment_client_serializer, world_repository, colony_service, 
                                    player_service, nuptial_environment_service, ant_service)

    world_facade.init_world()

    colony_service.set_world(world_facade.world)
    player_service.set_world(world_facade.world)
    nuptial_environment_service.set_world(world_facade.world)
    ant_service.set_world(world_facade.world)

    world_facade.world.run()