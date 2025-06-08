import { CONSTS } from "@domain/consts";
import { SEASON_TYPES } from "@domain/enum/season_types";

function convertStepsToSeason(steps) {
    let yearStep = steps % CONSTS.STEPS_IN_YEAR
    if (yearStep >= CONSTS.SPRING_START_YEAR_STEP && yearStep < CONSTS.SUMMER_START_YEAR_STEP) {
        return SEASON_TYPES.SPRING;
    } else if (yearStep >= CONSTS.SUMMER_START_YEAR_STEP && yearStep < CONSTS.AUTUMN_START_YEAR_STEP) {
        return SEASON_TYPES.SUMMER;
    } else if (yearStep >= CONSTS.AUTUMN_START_YEAR_STEP && yearStep < CONSTS.WINTER_START_YEAR_STEP) {
        return SEASON_TYPES.AUTUMN;
    } else if (yearStep >= CONSTS.WINTER_START_YEAR_STEP) {
        return SEASON_TYPES.WINTER;
    }
}

export {
    convertStepsToSeason
}