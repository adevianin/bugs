const CONSTS = {
    NEW_EGG_FOOD_COST: null,
    STEPS_IN_YEAR: null,
    SPRING_START_YEAR_STEP: null,
    SUMMER_START_YEAR_STEP: null,
    AUTUMN_START_YEAR_STEP: null,
    WINTER_START_YEAR_STEP: null,
    LAY_EGG_SEASONS: null,
    MAX_DISTANCE_TO_SUB_NEST: null,
    MAX_SUB_NEST_COUNT: null,
    REQUIRED_GENES: null,
    MAX_DISTANCE_TO_OPERATION_TARGET: null,
    BUILD_NEW_SUB_NEST_OPERATION_REQUIREMENTS: null,
    DESTROY_NEST_OPERATION_REQUIREMENTS: null
}

function initConts(constsValues) {
    Object.assign(CONSTS, constsValues)
}

export {
    CONSTS,
    initConts
}