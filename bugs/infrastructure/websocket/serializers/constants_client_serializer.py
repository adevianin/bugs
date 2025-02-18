from core.world.settings import (NEW_EGG_FOOD_COST, STEPS_IN_YEAR, SPRING_START_YEAR_STEP, SUMMER_START_YEAR_STEP, AUTUMN_START_YEAR_STEP, WINTER_START_YEAR_STEP,
                                 LAY_EGG_SEASONS, MAX_DISTANCE_TO_SUB_NEST, MAX_SUB_NEST_COUNT, MAX_DISTANCE_TO_OPERATION_TARGET)
from core.world.entities.ant.base.nuptial_environment.specie_builder.required_genes_list import REQUIRED_GENES
from core.world.entities.colony.colonies.ant_colony.operation.build_new_sub_nest_operation import BuildNewSubNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.destroy_nest_operation import DestroyNestOperation

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
            'MAX_DISTANCE_TO_SUB_NEST': MAX_DISTANCE_TO_SUB_NEST,
            'MAX_SUB_NEST_COUNT': MAX_SUB_NEST_COUNT,
            'REQUIRED_GENES': REQUIRED_GENES,
            'MAX_DISTANCE_TO_OPERATION_TARGET': MAX_DISTANCE_TO_OPERATION_TARGET,
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
            }
        }