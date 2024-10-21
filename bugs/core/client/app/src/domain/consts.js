const CONSTS = {
    NEW_EGG_FOOD_COST: null,
    STEPS_IN_YEAR: null
}

function initConts(constsValues) {
    Object.assign(CONSTS, constsValues)
}

export {
    CONSTS,
    initConts
}