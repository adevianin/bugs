from core.world.settings import (NEW_EGG_FOOD_COST, STEPS_IN_YEAR, SPRING_START_YEAR_STEP, SUMMER_START_YEAR_STEP, AUTUMN_START_YEAR_STEP, WINTER_START_YEAR_STEP,
                                 LAY_EGG_SEASONS, MAX_DISTANCE_TO_SUB_NEST, MAX_SUB_NEST_COUNT, MAX_DISTANCE_TO_OPERATION_TARGET, NUPTIAL_FLIGHT_SEASONS, 
                                 ITEM_SOURCE_BLOCKING_RADIUS, MAP_CHUNK_SIZE, VIEW_CHUNK_SIZE, NEST_BLOCKING_RADIUS, MAX_NAME_LENGTH, MIN_NAME_LENGTH, NEST_AREA)
from core.world.entities.ant.base.nuptial_environment.specie_builder.required_genes_list import REQUIRED_GENES
from core.world.entities.colony.colonies.ant_colony.operation.build_new_sub_nest_operation import BuildNewSubNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.destroy_nest_operation import DestroyNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.transport_food_operation import TransportFoodOperation
from core.world.entities.colony.colonies.ant_colony.operation.build_fortification_operation import BuildFortificationOperation

class ConstantsClientSerializer():

    def serialize_constants(self):
        return {
            'NEW_EGG_FOOD_COST': NEW_EGG_FOOD_COST,
            'STEPS_IN_YEAR': STEPS_IN_YEAR,
            'SPRING_START_YEAR_STEP': SPRING_START_YEAR_STEP,
            'SUMMER_START_YEAR_STEP': SUMMER_START_YEAR_STEP,
            'AUTUMN_START_YEAR_STEP': AUTUMN_START_YEAR_STEP,
            'WINTER_START_YEAR_STEP': WINTER_START_YEAR_STEP,
            'LAY_EGG_SEASONS': LAY_EGG_SEASONS,
            'NUPTIAL_FLIGHT_SEASONS': NUPTIAL_FLIGHT_SEASONS,
            'MAX_DISTANCE_TO_SUB_NEST': MAX_DISTANCE_TO_SUB_NEST,
            'MAX_SUB_NEST_COUNT': MAX_SUB_NEST_COUNT,
            'REQUIRED_GENES': REQUIRED_GENES,
            'MAX_DISTANCE_TO_OPERATION_TARGET': MAX_DISTANCE_TO_OPERATION_TARGET,
            'ITEM_SOURCE_BLOCKING_RADIUS': ITEM_SOURCE_BLOCKING_RADIUS,
            'NEST_BLOCKING_RADIUS': NEST_BLOCKING_RADIUS,
            'MAP_CHUNK_SIZE': MAP_CHUNK_SIZE,
            'VIEW_CHUNK_SIZE': VIEW_CHUNK_SIZE,
            'MAX_NAME_LENGTH': MAX_NAME_LENGTH,
            'MIN_NAME_LENGTH': MIN_NAME_LENGTH,
            'NEST_AREA': NEST_AREA,
            'BUILD_NEW_SUB_NEST_OPERATION_REQUIREMENTS': {
                'MAX_WARRIORS_COUNT': BuildNewSubNestOperation.MAX_WARRIORS_COUNT,
                'MIN_WARRIORS_COUNT': BuildNewSubNestOperation.MIN_WARRIORS_COUNT,
                'MAX_WORKERS_COUNT': BuildNewSubNestOperation.MAX_WORKERS_COUNT,
                'MIN_WORKERS_COUNT': BuildNewSubNestOperation.MIN_WORKERS_COUNT,
                'MIN_ANTS_COUNT': BuildNewSubNestOperation.MIN_ANTS_COUNT
            },
            'DESTROY_NEST_OPERATION_REQUIREMENTS': {
                'MAX_WARRIORS_COUNT': DestroyNestOperation.MAX_WARRIORS_COUNT,
                'MIN_WARRIORS_COUNT': DestroyNestOperation.MIN_WARRIORS_COUNT,
                'MAX_WORKERS_COUNT': DestroyNestOperation.MAX_WORKERS_COUNT,
                'MIN_WORKERS_COUNT': DestroyNestOperation.MIN_WORKERS_COUNT,
                'MIN_ANTS_COUNT': DestroyNestOperation.MIN_ANTS_COUNT
            },
            'PILLAGE_NEST_OPERATION_REQUIREMENTS': {
                'MAX_WARRIORS_COUNT': PillageNestOperation.MAX_WARRIORS_COUNT,
                'MIN_WARRIORS_COUNT': PillageNestOperation.MIN_WARRIORS_COUNT,
                'MAX_WORKERS_COUNT': PillageNestOperation.MAX_WORKERS_COUNT,
                'MIN_WORKERS_COUNT': PillageNestOperation.MIN_WORKERS_COUNT,
                'MIN_ANTS_COUNT': PillageNestOperation.MIN_ANTS_COUNT
            },
            'TRANSPORT_FOOD_OPERATION_REQUIREMENTS': {
                'MAX_WARRIORS_COUNT': TransportFoodOperation.MAX_WARRIORS_COUNT,
                'MIN_WARRIORS_COUNT': TransportFoodOperation.MIN_WARRIORS_COUNT,
                'MAX_WORKERS_COUNT': TransportFoodOperation.MAX_WORKERS_COUNT,
                'MIN_WORKERS_COUNT': TransportFoodOperation.MIN_WORKERS_COUNT,
                'MIN_ANTS_COUNT': TransportFoodOperation.MIN_ANTS_COUNT
            },
            'BUILD_FORTIFICATION_OPERATION_REQUIREMENTS': {
                'MAX_WARRIORS_COUNT': BuildFortificationOperation.MAX_WARRIORS_COUNT,
                'MIN_WARRIORS_COUNT': BuildFortificationOperation.MIN_WARRIORS_COUNT,
                'MAX_WORKERS_COUNT': BuildFortificationOperation.MAX_WORKERS_COUNT,
                'MIN_WORKERS_COUNT': BuildFortificationOperation.MIN_WORKERS_COUNT,
                'MIN_ANTS_COUNT': BuildFortificationOperation.MIN_ANTS_COUNT
            }
        }