const CONSTS = {
    NEW_EGG_FOOD_COST: null,
    STEPS_IN_YEAR: null,
    SPRING_START_YEAR_STEP: null,
    SUMMER_START_YEAR_STEP: null,
    AUTUMN_START_YEAR_STEP: null,
    WINTER_START_YEAR_STEP: null,
    LAY_EGG_SEASONS: null
}

function initConts(constsValues) {
    Object.assign(CONSTS, constsValues)
}

export {
    CONSTS,
    initConts
}