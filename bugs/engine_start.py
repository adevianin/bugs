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

from core.world.services.colony_service import ColonyService
from core.world.services.nuptial_service import NuptialService
from core.world.services.ant_service import AntService
from core.world.services.rating_serivice import RatingService
from core.world.services.world_service import WorldService
from core.world.services.notification_serivce import NotificationService
from core.world.services.colony_relations_service import ColonyRelationsService
from core.world.services.birthers.ant_birther_service import AntBirtherService
from core.world.services.birthers.item_birther_service import ItemBirtherService
from core.world.services.birthers.nest_birther_service import NestBirtherService
from core.world.services.birthers.ladybug_birther_service import LadybugBirtherService
from core.world.services.spawners.ladybug_spawner_service import LadybugSpawnerService
from core.world.services.spawners.bug_corpse_spawner_service import BugCorpseSpawnerService
from core.world.services.vision_service import VisionService
from core.world.services.thermal_service import ThermalService
from core.world.services.item_service import ItemService

from core.deserializers.nest_deserializer import NestDeserializer
from core.deserializers.ant_deserializer import AntDeserializer
from core.deserializers.colony_deserializer import ColonyDeserializer
from core.deserializers.thought_deserializer import ThoughtDeserializer
from core.deserializers.operation_deserializer import OperationDeserializer
from core.deserializers.item_source_deserializer import ItemSourceDeserializer
from core.deserializers.item_area_deserializer import ItemAreaDeserializer
from core.deserializers.formation_deserializer import FormationDeserializer
from core.deserializers.fight_deserializer import FightDeserializer
from core.deserializers.item_deserializer import ItemDeserializer
from core.deserializers.map_deserializer import MapDeserializer
from core.deserializers.gene_deserializer import GeneDeserializer
from core.deserializers.larva_deserializer import LarvaDeserializer
from core.deserializers.egg_deserializer import EggDeserializer
from core.deserializers.nuptial_environment_deserializer import NuptialEnvironmentDeserializer
from core.deserializers.genome_deserializer import GenomeDeserializer
from core.deserializers.climate_deserializer import ClimateDeserializer
from core.deserializers.notification_deserializer import NotificationDeserializer
from core.deserializers.death_record_deserializer import DeathRecordDeserializer
from core.deserializers.player_stats_deserializer import PlayerStatsDeserializer
from core.deserializers.colony_relations_table_deserializer import ColonyRelationsTableDeserializer
from core.deserializers.tree_deserializer import TreeDeserializer
from core.deserializers.ladybug_deserializer import LadybugDeserializer
from core.deserializers.world_deserializer import WorldDeserializer

from core.serializers.larva_serializer import LarvaSerializer
from core.serializers.egg_serializer import EggSerializer
from core.serializers.nest_serializer import NestSerializer
from core.serializers.world_serializer import WorldSerializer
from core.serializers.ant_serializer import AntSerializer
from core.serializers.thought_serializer import ThoughtSerializer
from core.serializers.colony_serializer import ColonySerializer
from core.serializers.operation_serializer import OperationSerializer
from core.serializers.colony_relations_table_serializer import ColonyRelationsTableSerializer
from core.serializers.item_serializer import ItemSerializer
from core.serializers.item_area_serializer import ItemAreaSerializer
from core.serializers.item_source_serializer import ItemSourceSerializer
from core.serializers.formation_serializer import FormationSerializer
from core.serializers.fight_serializer import FightSerializer
from core.serializers.genes_serializer import GenesSerializer
from core.serializers.nuptial_environment_serializer import NuptialEnvironmentSerializer
from core.serializers.genome_serializer import GenomeSerializer
from core.serializers.climate_serializer import ClimateSerializer
from core.serializers.notification_serializer import NotificationSerializer
from core.serializers.death_record_serializer import DeathRecordSerializer
from core.serializers.player_stats_serializer import PlayerStatsSerializer
from core.serializers.tree_serializer import TreeSerializer
from core.serializers.ladybug_serializer import LadybugSerializer

from core.client_serializers.world_client_serializer import WorldClientSerializer
from core.client_serializers.colony_client_serializer import ColonyClientSerializer
from core.client_serializers.operation_client_serializer import OperationClientSerializer
from core.client_serializers.util_client_serializer import UtilClientSerializer
from core.client_serializers.larva_client_serializer import LarvaClientSerializer
from core.client_serializers.egg_client_serializer import EggClientSerializer
from core.client_serializers.stats_client_serializer import StatsClientSerializer
from core.client_serializers.item_client_serializer import ItemClientSerializer
from core.client_serializers.item_source_client_serializer import ItemSourceClientSerializer
from core.client_serializers.item_area_client_serializer import ItemAreaClientSerializer
from core.client_serializers.nest_client_serializer import NestClientSerializer
from core.client_serializers.ant_client_serializer import AntClientSerializer
from core.client_serializers.action_client_serializer import ActionClientSerializer
from core.client_serializers.common_entity_client_serializer import CommonEntityClientSerializer
from core.client_serializers.genes_client_serializer import GenesClientSerializer
from core.client_serializers.genome_client_serializer import GenomeClientSerializer
from core.client_serializers.nuptial_environment_client_serializer import NuptialEnvironmentClientSerializer
from core.client_serializers.climate_client_serializer import ClimateClientSerializer
from core.client_serializers.constants_client_serializer import ConstantsClientSerializer
from core.client_serializers.notification_client_serializer import NotificationClientSerializer
from core.client_serializers.death_record_client_serializer import DeathRecordClientSerializer
from core.client_serializers.tree_client_serializer import TreeClientSerializer
from core.client_serializers.ladybug_client_serializer import LadybugClientSerializer

from core.engine import Engine
from decouple import config
import logging, redis

def main():
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    file_handler = logging.FileHandler('game_errors.log')
    file_handler.setLevel(logging.ERROR)
    formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s')
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

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
    world_factory = WorldFactory(event_bus, ant_factory, item_factory, nest_factory, ladybug_factory, logger)

    colony_service = ColonyService(event_bus, colony_factory, operation_factory)
    nuptial_environment_service = NuptialService(event_bus, nuptial_environment_factory)
    ant_service = AntService(event_bus)
    rating_service = RatingService(event_bus, player_stats_factory)
    notification_service = NotificationService(event_bus)
    colony_relations_service = ColonyRelationsService(event_bus)
    ant_birther_service = AntBirtherService(event_bus, ant_factory)
    item_birther_service = ItemBirtherService(event_bus, item_factory)
    nest_birther_service = NestBirtherService(event_bus, nest_factory)
    ladybug_birther_service = LadybugBirtherService(event_bus, ladybug_factory)
    ladybug_spawner_service = LadybugSpawnerService(event_bus)
    bug_corpse_spawner_service = BugCorpseSpawnerService(event_bus)
    vision_serivce = VisionService(event_bus)
    thermal_service = ThermalService(event_bus)
    item_service = ItemService(event_bus)
    world_service = WorldService(event_bus, world_factory, map_factory, colony_factory, climate_factory, tree_factory, item_area_factory, item_source_factory)

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
                                                      operation_client_serializer, notification_client_serializer, nuptial_environment_client_serializer, genome_client_serializer)
    constants_client_serializer = ConstantsClientSerializer()

    # listener = Listener(('localhost', 6000), authkey=config('SECRET_KEY').encode('utf-8'))
    r = redis.Redis(config('REDIS_HOST'), config('REDIS_PORT'), password=config('REDIS_PASSWORD'), decode_responses=True)

    services = {
        'colony_service': colony_service,
        'nuptial_environment_service': nuptial_environment_service,
        'ant_service': ant_service, 
        'rating_service': rating_service, 
        'notification_service': notification_service, 
        'colony_relations_service': colony_relations_service, 
        'ant_birther_service': ant_birther_service, 
        'item_birther_service': item_birther_service, 
        'nest_birther_service': nest_birther_service, 
        'ladybug_birther_service': ladybug_birther_service,
        'ladybug_spawner_service': ladybug_spawner_service, 
        'bug_corpse_spawner_service': bug_corpse_spawner_service, 
        'vision_serivce': vision_serivce, 
        'thermal_service': thermal_service, 
        'item_service': item_service,
        'world_service': world_service
    }
    client_serializers = {
        'stats_client_serializer': stats_client_serializer,
        'genes_client_serializer': genes_client_serializer,
        'genome_client_serializer': genome_client_serializer,
        'larva_client_serializer': larva_client_serializer,
        'egg_client_serializer': egg_client_serializer,
        'util_client_serializer': util_client_serializer,
        'operation_client_serializer': operation_client_serializer,
        'colony_client_serializer': colony_client_serializer,
        'item_client_serializer': item_client_serializer,
        'item_source_client_serializer': item_source_client_serializer,
        'item_area_client_serializer': item_area_client_serializer,
        'nest_client_serializer': nest_client_serializer,
        'ant_client_serializer': ant_client_serializer,
        'tree_client_serializer': tree_client_serializer,
        'ladybug_client_serializer': ladybug_client_serializer,
        'common_entity_client_serializer': common_entity_client_serializer,
        'climate_client_serializer': climate_client_serializer,
        'world_client_serializer': world_client_serializer,
        'death_record_client_serializer': death_record_client_serializer,
        'notification_client_serializer': notification_client_serializer,
        'nuptial_environment_client_serializer': nuptial_environment_client_serializer,
        'action_client_serializer': action_client_serializer,
        'constants_client_serializer': constants_client_serializer
    }
    engine = Engine(event_bus, r, logger, services, client_serializers, world_deserializer, world_serializer)
    try:
        engine.start()
    except KeyboardInterrupt:
        logger.info('stopping engine')
    finally:
        engine.stop()
        r.close()

if __name__ == '__main__':
    main()