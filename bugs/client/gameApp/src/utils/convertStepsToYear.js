import { CONSTS } from "@domain/consts"

function convertStepsToYear(steps, precise = false) {
    const years = steps / CONSTS.STEPS_IN_YEAR;
    return precise ? parseFloat(years.toFixed(1)) : Math.floor(years);
}


export {
    convertStepsToYear
}