from infrastructure.db.repositories.world_data_repository import WorldDataRepository
from infrastructure.db.repositories.world_repository import WorldRepository
from infrastructure.db.repositories.usernames_repository import UsernamesRepository

from infrastructure.db.deserializers.nest_deserializer import NestDeserializer
from infrastructure.db.deserializers.ant_deserializer import AntDeserializer
from infrastructure.db.deserializers.colony_deserializer import ColonyDeserializer
from infrastructure.db.deserializers.thought_deserializer import ThoughtDeserializer
from infrastructure.db.deserializers.operation_deserializer import OperationDeserializer
from infrastructure.db.deserializers.item_source_deserializer import ItemSourceDeserializer
from infrastructure.db.deserializers.item_area_deserializer import ItemAreaDeserializer
from infrastructure.db.deserializers.formation_deserializer import FormationDeserializer
from infrastructure.db.deserializers.fight_deserializer import FightDeserializer
from infrastructure.db.deserializers.item_deserializer import ItemDeserializer
from infrastructure.db.deserializers.map_deserializer import MapDeserializer
from infrastructure.db.deserializers.gene_deserializer import GeneDeserializer
from infrastructure.db.deserializers.larva_deserializer import LarvaDeserializer
from infrastructure.db.deserializers.egg_deserializer import EggDeserializer
from infrastructure.db.deserializers.nuptial_environment_deserializer import NuptialEnvironmentDeserializer
from infrastructure.db.deserializers.genome_deserializer import GenomeDeserializer
from infrastructure.db.deserializers.climate_deserializer import ClimateDeserializer
from infrastructure.db.deserializers.notification_deserializer import NotificationDeserializer
from infrastructure.db.deserializers.death_record_deserializer import DeathRecordDeserializer
from infrastructure.db.deserializers.player_stats_deserializer import PlayerStatsDeserializer
from infrastructure.db.deserializers.colony_relations_table_deserializer import ColonyRelationsTableDeserializer
from infrastructure.db.deserializers.tree_deserializer import TreeDeserializer
from infrastructure.db.deserializers.ladybug_deserializer import LadybugDeserializer
from infrastructure.db.deserializers.world_deserializer import WorldDeserializer

from infrastructure.db.serializers.larva_serializer import LarvaSerializer
from infrastructure.db.serializers.egg_serializer import EggSerializer
from infrastructure.db.serializers.nest_serializer import NestSerializer
from infrastructure.db.serializers.world_serializer import WorldSerializer
from infrastructure.db.serializers.ant_serializer import AntSerializer
from infrastructure.db.serializers.thought_serializer import ThoughtSerializer
from infrastructure.db.serializers.colony_serializer import ColonySerializer
from infrastructure.db.serializers.operation_serializer import OperationSerializer
from infrastructure.db.serializers.colony_relations_table_serializer import ColonyRelationsTableSerializer
from infrastructure.db.serializers.item_serializer import ItemSerializer
from infrastructure.db.serializers.item_area_serializer import ItemAreaSerializer
from infrastructure.db.serializers.item_source_serializer import ItemSourceSerializer
from infrastructure.db.serializers.formation_serializer import FormationSerializer
from infrastructure.db.serializers.fight_serializer import FightSerializer
from infrastructure.db.serializers.genes_serializer import GenesSerializer
from infrastructure.db.serializers.nuptial_environment_serializer import NuptialEnvironmentSerializer
from infrastructure.db.serializers.genome_serializer import GenomeSerializer
from infrastructure.db.serializers.climate_serializer import ClimateSerializer
from infrastructure.db.serializers.notification_serializer import NotificationSerializer
from infrastructure.db.serializers.death_record_serializer import DeathRecordSerializer
from infrastructure.db.serializers.player_stats_serializer import PlayerStatsSerializer
from infrastructure.db.serializers.tree_serializer import TreeSerializer
from infrastructure.db.serializers.ladybug_serializer import LadybugSerializer

from core.world.world_facade import WorldFacade
from core.world.utils.event_emiter import EventEmitter

from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.world.world_factory import WorldFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.map.map_factory import MapFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.fight.fight_factory import FightFactory
from core.world.entities.item.items.item_factory import ItemFactory
from core.world.entities.item.item_sources.item_source_factory import ItemSourceFactory
from core.world.entities.item.item_areas.item_area_factory import ItemAreaFactory
from core.world.entities.climate.climate_factory import ClimateFactory
from core.world.entities.world.player_stats_factory import PlayerStatsFactory
from core.world.entities.ant.base.nuptial_environment.nuptial_environment_factory import NuptialEnvironmentFactory
from core.world.entities.tree.tree_factory import TreeFactory
from core.world.entities.ladybug.ladybug_factory import LadybugFactory

from core.world.services.player_service import PlayerService
from core.world.services.colony_service import ColonyService
from core.world.services.nuptial_environment_service import NuptialEnvironmentService
from core.world.services.ant_service import AntService
from core.world.services.rating_serivice import RatingService
from core.world.services.world_service import WorldService

from infrastructure.websocket.serializers.world_client_serializer import WorldClientSerializer
from infrastructure.websocket.serializers.colony_client_serializer import ColonyClientSerializer
from infrastructure.websocket.serializers.operation_client_serializer import OperationClientSerializer
from infrastructure.websocket.serializers.util_client_serializer import UtilClientSerializer
from infrastructure.websocket.serializers.larva_client_serializer import LarvaClientSerializer
from infrastructure.websocket.serializers.egg_client_serializer import EggClientSerializer
from infrastructure.websocket.serializers.stats_client_serializer import StatsClientSerializer
from infrastructure.websocket.serializers.item_client_serializer import ItemClientSerializer
from infrastructure.websocket.serializers.item_source_client_serializer import ItemSourceClientSerializer
from infrastructure.websocket.serializers.item_area_client_serializer import ItemAreaClientSerializer
from infrastructure.websocket.serializers.nest_client_serializer import NestClientSerializer
from infrastructure.websocket.serializers.ant_client_serializer import AntClientSerializer
from infrastructure.websocket.serializers.action_client_serializer import ActionClientSerializer
from infrastructure.websocket.serializers.common_entity_client_serializer import CommonEntityClientSerializer
from infrastructure.websocket.serializers.genes_client_serializer import GenesClientSerializer
from infrastructure.websocket.serializers.genome_client_serializer import GenomeClientSerializer
from infrastructure.websocket.serializers.nuptial_environment_client_serializer import NuptialEnvironmentClientSerializer
from infrastructure.websocket.serializers.climate_client_serializer import ClimateClientSerializer
from infrastructure.websocket.serializers.constants_client_serializer import ConstantsClientSerializer
from infrastructure.websocket.serializers.notification_client_serializer import NotificationClientSerializer
from infrastructure.websocket.serializers.death_record_client_serializer import DeathRecordClientSerializer
from infrastructure.websocket.serializers.tree_client_serializer import TreeClientSerializer
from infrastructure.websocket.serializers.ladybug_client_serializer import LadybugClientSerializer
from infrastructure.websocket.step_data_manager import StepDataManager

import logging

def init():
    game_logger = logging.getLogger('game_logger')

    event_bus = EventEmitter()

    item_factory = ItemFactory(event_bus)
    item_source_factory = ItemSourceFactory(event_bus)
    item_area_factory = ItemAreaFactory(event_bus)
    formation_factory = FormationFactory()
    fight_factory = FightFactory()
    thought_factory = ThoughtFactory()
    ant_factory = AntFactory(event_bus, thought_factory)
    nest_factory = NestFactory(event_bus)
    operation_factory = OperationFactory(event_bus, formation_factory, fight_factory)
    colony_factory = ColonyFactory(event_bus, operation_factory)
    map_factory = MapFactory(event_bus)
    climate_factory = ClimateFactory(event_bus)
    player_stats_factory = PlayerStatsFactory(event_bus)
    nuptial_environment_factory = NuptialEnvironmentFactory(event_bus)
    tree_factory = TreeFactory(event_bus)
    ladybug_factory = LadybugFactory(event_bus, thought_factory)
    world_factory = WorldFactory(event_bus, ant_factory, item_factory, nest_factory, ladybug_factory, game_logger)
    
    genes_serializer = GenesSerializer()
    genome_serializer = GenomeSerializer(genes_serializer)
    larva_serializer = LarvaSerializer(genome_serializer)
    egg_serializer = EggSerializer(genome_serializer)
    nest_serializer = NestSerializer(larva_serializer, egg_serializer)
    thought_serializer = ThoughtSerializer()
    ant_serializer = AntSerializer(genome_serializer)
    formation_serializer = FormationSerializer()
    fight_serializer = FightSerializer()
    operation_serializer = OperationSerializer(formation_serializer, fight_serializer)
    colony_serializer = ColonySerializer(operation_serializer)
    colony_relations_table_serializer = ColonyRelationsTableSerializer()
    item_serializer = ItemSerializer()
    item_area_serializer = ItemAreaSerializer()
    item_source_serializer = ItemSourceSerializer()
    nuptial_environment_serializer = NuptialEnvironmentSerializer(genes_serializer, genome_serializer)
    climate_serializer = ClimateSerializer()
    death_record_serializer = DeathRecordSerializer()
    notification_serializer = NotificationSerializer(death_record_serializer)
    player_stats_serializer = PlayerStatsSerializer()
    tree_serializer = TreeSerializer()
    ladybug_serializer = LadybugSerializer()
    world_serializer = WorldSerializer(nest_serializer, ant_serializer, item_serializer, item_area_serializer, item_source_serializer, colony_serializer, 
                                       colony_relations_table_serializer, nuptial_environment_serializer, climate_serializer, 
                                       thought_serializer, notification_serializer, player_stats_serializer, tree_serializer, ladybug_serializer)

    gene_deserializer = GeneDeserializer()
    genome_deserializer = GenomeDeserializer(gene_deserializer)
    larva_deserializer = LarvaDeserializer(genome_deserializer)
    egg_deserializer = EggDeserializer(genome_deserializer)
    nest_deserializer = NestDeserializer(larva_deserializer, egg_deserializer, nest_factory)
    ant_deserializer = AntDeserializer(genome_deserializer, ant_factory)
    formation_deserializer = FormationDeserializer(formation_factory)
    fight_deserializer = FightDeserializer(fight_factory)
    operation_deserializer = OperationDeserializer(operation_factory, formation_deserializer, fight_deserializer)
    map_deserializer = MapDeserializer(map_factory)
    colony_deserializer = ColonyDeserializer(colony_factory, operation_deserializer)
    thought_deserializer = ThoughtDeserializer(thought_factory)
    item_deserializer = ItemDeserializer(item_factory)
    item_source_deserializer = ItemSourceDeserializer(item_source_factory)
    item_area_deserializer = ItemAreaDeserializer(item_area_factory)
    nuptial_environment_deserializer = NuptialEnvironmentDeserializer(gene_deserializer, genome_deserializer, nuptial_environment_factory)
    climate_deserializer = ClimateDeserializer(climate_factory)
    death_record_deserializer = DeathRecordDeserializer()
    notification_deserializer = NotificationDeserializer(death_record_deserializer)
    player_stats_deserializer = PlayerStatsDeserializer(player_stats_factory)
    colony_relations_table_deserializer = ColonyRelationsTableDeserializer()
    tree_deserializer = TreeDeserializer(tree_factory)
    ladybug_deserializer = LadybugDeserializer(ladybug_factory)
    world_deserializer = WorldDeserializer(world_factory, nest_deserializer, ant_deserializer, colony_deserializer, thought_deserializer, map_deserializer, 
                                           item_deserializer, item_source_deserializer, item_area_deserializer, nuptial_environment_deserializer, 
                                           climate_deserializer, notification_deserializer, player_stats_deserializer, colony_relations_table_deserializer, tree_deserializer,
                                           ladybug_deserializer)
    
    world_data_repository = WorldDataRepository()
    world_repository = WorldRepository(world_data_repository, world_serializer, world_deserializer)
    usernames_repository = UsernamesRepository()

    colony_service = ColonyService(operation_factory)
    player_service = PlayerService(event_bus, colony_factory, ant_factory, nuptial_environment_factory, player_stats_factory)
    nuptial_environment_service = NuptialEnvironmentService(colony_factory)
    ant_service = AntService()
    rating_service = RatingService(event_bus, usernames_repository)
    world_service = WorldService(world_factory, map_factory, colony_factory, climate_factory, tree_factory, item_area_factory, item_source_factory)

    world_facade = WorldFacade(event_bus, world_repository, colony_service, player_service, nuptial_environment_service, ant_service, rating_service, world_service)

    stats_client_serializer = StatsClientSerializer()
    genes_client_serializer = GenesClientSerializer()
    genome_client_serializer = GenomeClientSerializer(genes_client_serializer)
    larva_client_serializer = LarvaClientSerializer(genome_client_serializer)
    egg_client_serializer = EggClientSerializer(genome_client_serializer)
    util_client_serializer = UtilClientSerializer()
    operation_client_serializer = OperationClientSerializer(util_client_serializer)
    colony_client_serializer = ColonyClientSerializer(operation_client_serializer)
    item_client_serializer = ItemClientSerializer(util_client_serializer)
    item_source_client_serializer = ItemSourceClientSerializer(util_client_serializer)
    item_area_client_serializer = ItemAreaClientSerializer(util_client_serializer)
    nest_client_serializer = NestClientSerializer(util_client_serializer, larva_client_serializer, egg_client_serializer)
    ant_client_serializer = AntClientSerializer(util_client_serializer, stats_client_serializer, genome_client_serializer)
    tree_client_serializer = TreeClientSerializer(util_client_serializer)
    ladybug_client_serializer = LadybugClientSerializer(util_client_serializer)
    common_entity_client_serializer = CommonEntityClientSerializer(item_client_serializer, item_source_client_serializer, item_area_client_serializer, nest_client_serializer, ant_client_serializer, tree_client_serializer, ladybug_client_serializer)
    climate_client_serializer = ClimateClientSerializer()
    world_client_serializer = WorldClientSerializer(common_entity_client_serializer, colony_client_serializer, climate_client_serializer)
    death_record_client_serializer = DeathRecordClientSerializer(util_client_serializer)
    notification_client_serializer = NotificationClientSerializer(util_client_serializer, death_record_client_serializer)
    nuptial_environment_client_serializer = NuptialEnvironmentClientSerializer(genome_client_serializer, genes_client_serializer, stats_client_serializer)
    action_client_serializer = ActionClientSerializer(common_entity_client_serializer, util_client_serializer, larva_client_serializer, egg_client_serializer, colony_client_serializer, 
                                                      operation_client_serializer, notification_client_serializer, nuptial_environment_client_serializer)
    constants_client_serializer = ConstantsClientSerializer()
    step_data_manager = StepDataManager(world_facade, world_client_serializer, nuptial_environment_client_serializer, constants_client_serializer, notification_client_serializer, action_client_serializer)
    