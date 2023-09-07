from enum import StrEnum

class OperationTypes(StrEnum):
    BUILD_NEW_NEST = 'build_new_nest'
    DESTROY_NEST = 'destroy_nest'
    BRING_ITEM_TO_NEST = 'bring_item_to_nest'