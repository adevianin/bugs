from enum import StrEnum

class OperationTypes(StrEnum):
    BUILD_NEW_SUB_NEST = 'build_new_sub_nest'
    DESTROY_NEST = 'destroy_nest'
    PILLAGE_NEST = 'pillage_nest'
    BRING_ITEM_TO_NEST = 'bring_item_to_nest'
    TRANSPORT_FOOD = 'transport_food'
    