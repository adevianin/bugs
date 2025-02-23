import { CONSTS } from "@domain/consts"

function convertStepsToYear(steps) {
    return Math.floor(steps / CONSTS.STEPS_IN_YEAR);
}

export {
    convertStepsToYear
}