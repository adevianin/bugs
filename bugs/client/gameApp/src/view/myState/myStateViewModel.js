import { BaseViewModel } from "./baseViewModel";
import { ColonyViewModel } from "./colonyViewModel";
import { AntViewModel } from "./antViewModel";
import { NestViewModel } from "./nestViewModel";
import { NuptialEnvironmentViewModel } from "./nuptialEnvironmentViewModel";
import { NotificationsContainerViewModel } from "./notificationsContainerViewModel";
import { CONSTS } from "@domain/consts";

class MyStateViewModel extends BaseViewModel {

    static buildFromJson(json) {

        let colonies = [];
        for (let colonyJson of json.colonies) {
            colonies.push(ColonyViewModel.buildFromJson(colonyJson));
        }

        let ants = [];
        for (let antJson of json.ants) {
            ants.push(AntViewModel.buildFromJson(antJson));
        }

        let nests = [];
        for (let nestJson of json.nests) {
            nests.push(NestViewModel.buildFromJson(nestJson));
        }

        let nuptialEnvironment = NuptialEnvironmentViewModel.buildFromJson(json.nuptialEnvironment);
        let notificationsContainer = NotificationsContainerViewModel.buildFromJson(json.notificationsContainer);

        return new MyStateViewModel(colonies, ants, nests, nuptialEnvironment, notificationsContainer);
    }

    constructor(colonies, ants, nests, nuptialEnvironment, notificationsContainer) {
        super({});
        this._colonies = colonies;
        this._ants = ants;
        this._nests = nests;
        this._nuptialEnvironment = nuptialEnvironment;
        this._notificationsContainer = notificationsContainer;
    }

    get colonies() {
        return [...this._colonies];
    }

    get ants() {
        return [...this._ants];
    }

    get nests() {
        return [...this._nests];
    }

    get nuptialEnvironment() {
        return this._nuptialEnvironment;
    }

    get notificationsContainer() {
        return this._notificationsContainer;
    }

    getNestsFromColony(colonyId) {
        return this._nests.filter(n => n.fromColony == colonyId);
    }

    getAntsFromColony(colonyId) {
        return this._ants.filter(a => a.fromColony == colonyId);
    }

    getMainNestOfColony(colonyId) {
        return this._nests.find(n => n.fromColony == colonyId && n.isMain);
    }

    getNestById(id) {
        return this._nests.find(n => n.id == id);
    }

    getColonyById(id) {
        return this._colonies.find(c => c.id == id);
    }

    getAntById(id) {
        return this._ants.find(a => a.id == id);
    }

    getAntsByIds(ids) {
        return this._ants.filter(a => ids.includes(a.id));
    }

    findFirstNest() {
        let mainNest = this._nests.find(n => n.isMain);
        if (mainNest) {
            return mainNest;
        } else if (this._nests.length > 0) {
            return this._nests[0];
        } else {
            return null;
        }
    }

    addNest(nest) {
        this._nests.push(nest);
        this.emit('nestBorn', nest);
        this.emit(`nestBorn:${nest.fromColony}`, nest);
    }

    removeNest(nestId) {
        let index = this._nests.findIndex(n => n.id == nestId);
        if (index != -1) {
            let nests = this._nests.splice(index, 1);
            let nest = nests[0];
            this.emit('nestDied', nest);
            this.emit(`nestDied:${nest.fromColony}`, nest);
        }
    }

    addAnt(ant) {
        this._ants.push(ant);
        this.emit('antBorn', ant);
    }

    removeAnt(antId) {
        let index = this._ants.findIndex(a => a.id == antId);
        if (index != -1) {
            let ants = this._ants.splice(index, 1);
            let ant = ants[0];
            this.emit('antDied', ant);
        }
    }

    addColony(colony) {
        this._colonies.push(colony);
        this.emit('colonyBorn', colony);
    }

    removeColony(colonyId) {
        let index = this._colonies.findIndex(c => c.id == colonyId);
        if (index != -1) {
            let colonies = this._colonies.splice(index, 1);
            let colony = colonies[0];
            this.emit('colonyDied', colony);
        }
    }

    applyPatch(patch) {
        this._applyNestsPatch(patch.nests);
        this._applyColoniesPatch(patch.colonies);
        this._applyAntsPatch(patch.ants);
        this.nuptialEnvironment.applyPatch(patch.nuptialEnvironment);
        this.notificationsContainer.applyPatch(patch.notificationsContainer);
    }

    calcRequiredFoodReserveForNest(nest) {
        let ants = this._ants.filter(a => a.homeNestId == nest.id && a.fromColony == nest.fromColony);
        let hungerPeriod = CONSTS.SUMMER_START_YEAR_STEP - CONSTS.SPRING_START_YEAR_STEP;
        let antsEatePerStep = 0;
        for (let ant of ants) {
            antsEatePerStep += ant.stats.appetite;
        }

        return hungerPeriod * antsEatePerStep;
    }

    _applyNestsPatch(nestsPatch) {
        for (let addedNestJson of nestsPatch.add) {
            let nestVM = NestViewModel.buildFromJson(addedNestJson);
            this.addNest(nestVM);
        }
        for (let nestUpdatePatch of nestsPatch.update) {
            let nestVM = this.getNestById(nestUpdatePatch.id);
            nestVM.applyPatch(nestUpdatePatch);
        }
        for (let nestId of nestsPatch.remove) {
            this.removeNest(nestId);
        }
    }

    _applyColoniesPatch(coloniesPatch) {
        for (let addedColonyJson of coloniesPatch.add) {
            let colonyVM = ColonyViewModel.buildFromJson(addedColonyJson);
            this.addColony(colonyVM);
        }
        for (let colonyUpdatePatch of coloniesPatch.update) {
            let colonyVM = this.getColonyById(colonyUpdatePatch.id);
            colonyVM.applyPatch(colonyUpdatePatch);
        }
        for (let colonyId of coloniesPatch.remove) {
            this.removeColony(colonyId);
        }
    }

    _applyAntsPatch(antsPatch) {
        for (let addedAntJson of antsPatch.add) {
            let antVM = AntViewModel.buildFromJson(addedAntJson);
            this.addAnt(antVM);
        }
        for (let antUpdatePatch of antsPatch.update) {
            let antVM = this.getAntById(antUpdatePatch.id);
            antVM.applyPatch(antUpdatePatch);
        }
        for (let antId of antsPatch.remove) {
            this.removeAnt(antId);
        }
    }

}

export {
    MyStateViewModel
}