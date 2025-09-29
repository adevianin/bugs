import { BaseGameService } from "./base/baseGameService";
import { CONSTS } from "@domain/consts";
import { distance } from '@utils/distance';
import { GAME_MESSAGE_IDS } from "@messages/messageIds";

class NestService extends BaseGameService {

    constructor(mainEventBus, world, commandMessenger) {
        super(mainEventBus, world);
        this._commandMessenger = commandMessenger;
    }

    async layEggInNest(nestId, name, isFertilized) {
        try {
            let eggId = await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('add_egg', {
                nest_id: nestId,
                name: name,
                is_fertilized: isFertilized
            }));
            return this._makeSuccessResult({ eggId: eggId });
        } catch (e) {
            return this._handlePlayerCommandKnownErrors(e);
        }
    }

    async changeEggCasteInNest(nestId, eggId, antType) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('change_egg_caste', {
            nest_id: nestId,
            egg_id: eggId,
            ant_type: antType
        }));
        let nest = this._world.findEntityById(nestId);
        nest.changeCasteForEgg(eggId, antType);
    }

    async changeEggNameInNest(nestId, eggId, name) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('change_egg_name', {
            nest_id: nestId,
            egg_id: eggId,
            name: name
        }));
        let nest = this._world.findEntityById(nestId);
        nest.changeNameForEgg(eggId, name);
    }

    async deleteEggInNest(nestId, eggId) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('delete_egg', {
            nest_id: nestId,
            egg_id: eggId
        }));
    }

    async deleteLarvaInNest(nestId, larvaId) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('delete_larva', {
            nest_id: nestId,
            larva_id: larvaId
        }));
    }

    async renameNest(nestId, name) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('rename_nest', {
            nest_id: nestId,
            name: name
        }));
    }

    validateLayingEggInNest(nestId) {
        let nest = this._world.findEntityById(nestId);

        let queen = this._world.getQueenOfColony(nest.fromColony);
        if (!queen || queen.locatedInNestId != nest.id) {
            return GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST;
        }

        if (nest.storedCalories < CONSTS.NEW_EGG_FOOD_COST) {
            return GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG;
        }

        if (!CONSTS.LAY_EGG_SEASONS.includes(this._world.currentSeason)) {
            return GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NOT_SUITABLE_SEASON_TO_LAY_EGG;
        }

        return null;
    }

    // findMyFirstNest(userId) {
    //     let myNests = this._world.findNestsByOwner(userId);
    //     for (let nest of myNests) {
    //         if (nest.isMain) {
    //             return nest;
    //         }
    //     }

    //     if (myNests.length > 0) {
    //         return myNests[0];
    //     } else {
    //         return null;
    //     }
    // }

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