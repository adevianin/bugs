import { BaseGameService } from "./base/baseGameService";
import { CONSTS } from "@domain/consts";
import { distance } from '@utils/distance';

class NestService extends BaseGameService {

    constructor(mainEventBus, world, nestApi) {
        super(mainEventBus, world);
        this._nestApi = nestApi;
    }

    layEggInNest(nestId, name, isFertilized) {
        return this._requestHandler(() => this._nestApi.layEggInNest(nestId, name, isFertilized));
    }

    async changeEggCasteInNest(nestId, eggId, antType) {
        await this._requestHandler(() => this._nestApi.changeEggCaste(nestId, eggId, antType));
        let nest = this._world.findEntityById(nestId);
        nest.changeCasteForEgg(eggId, antType);
    }

    async changeEggNameInNest(nestId, eggId, name) {
        await this._requestHandler(() => this._nestApi.changeEggName(nestId, eggId, name));
        let nest = this._world.findEntityById(nestId);
        nest.changeNameForEgg(eggId, name);
    }

    async moveEggToLarvaInNest(nestId, eggId) {
        await this._requestHandler(() => this._nestApi.eggToLarvaChamber(nestId, eggId));
    }

    async deleteEggInNest(nestId, eggId) {
        let nest = this._world.findEntityById(nestId);
        nest.eggDelete(eggId);
        await this._requestHandler(() => this._nestApi.eggDelete(nestId, eggId));
    }

    async deleteLarvaInNest(nestId, larvaId) {
        let nest = this._world.findEntityById(nestId);
        nest.larvaDelete(larvaId);
        await this._requestHandler(() => this._nestApi.larvaDelete(nestId, larvaId));
    }

    async renameNest(nestId, name) {
        await this._requestHandler(() => this._nestApi.renameNest(nestId, name));
        let nest = this._world.findEntityById(nestId);
        nest.rename(name);
    }

    validateLayingEggInNest(nestId) {
        let nest = this._world.findEntityById(nestId);

        let queen = this._world.getQueenOfColony(nest.fromColony);
        if (!queen || queen.locatedInNestId != nest.id) {
            return 'CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST';
        }

        if (nest.storedCalories < CONSTS.NEW_EGG_FOOD_COST) {
            return'NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG';
        }

        if (!CONSTS.LAY_EGG_SEASONS.includes(this._world.currentSeason)) {
            return 'NOT_SUITABLE_SEASON_TO_LAY_EGG';
        }

        return null;
    }

    findMyFirstNest(userId) {
        let myNests = this._world.findNestsByOwner(userId);
        for (let nest of myNests) {
            if (nest.isMain) {
                return nest;
            }
        }

        if (myNests.length > 0) {
            return myNests[0];
        } else {
            return null;
        }
    }

    findNearestNest(point, excludeColonyId) {
        let nests = this._world.getNests();
        let nearestNest = null;
        let smallestDistance = null;
        let maxDist = 100;

        nests.forEach(nest => {
            let dist = distance(point.x, point.y, nest.position.x, nest.position.y);
            if (!nest.isDied && (!excludeColonyId || nest.fromColony != excludeColonyId) && dist <= maxDist && (!smallestDistance || dist < smallestDistance)) {
                smallestDistance = dist;
                nearestNest = nest;
            }
        });

        return nearestNest;
    }

}

export {
    NestService
}