import { EntityViewModel } from "./entityViewModel"
import { EggViewModel } from "./eggViewModel";
import { LarvaViewModel } from "./larvaViewModel";

class NestViewModel extends EntityViewModel {

    static buildFromJson(json) {
        let eggs = [];
        for (let eggJson of json.eggs) {
            eggs.push(EggViewModel.buildFromJson(eggJson));
        }
        delete json.eggs;


        let larvae = [];
        for (let larvaJson of json.larvae) {
            larvae.push(LarvaViewModel.buildFromJson(larvaJson));
        }
        delete json.larvae;

        return new NestViewModel(json, eggs, larvae);
    }

    get storedCalories() {
        return this._props.storedCalories;
    }

    set storedCalories(val) {
        this._props.storedCalories = val;
        this.emit('storedCaloriesChanged');
    }

    get name() {
        return this._props.name;
    }

    set name(val) {
        this._props.name = val;
        this.emit('nameChanged');
    }

    get isMain() {
        return this._props.isMain;
    }

    get larvae() {
        return this._larvae;
    }

    get eggs() {
        return this._eggs;
    }

    constructor(json, eggs, larvae) {
        super(json);
        this._eggs = eggs;
        this._larvae = larvae;
    }

    addEgg(egg) {
        this._eggs.push(egg);
        this.emit('eggAdded', egg);
        this.emit(`eggAdded:${egg.id}`);
    }

    removeEgg(eggId) {
        let index = this._eggs.findIndex(egg => egg.id == eggId);
        if (index != -1) {
            let eggs = this._eggs.splice(index, 1);
            this.emit('eggRemoved', eggs[0]);
        }
    }

    hasEgg(eggId) {
        let index = this._eggs.findIndex(egg => egg.id == eggId);
        return index !== -1
    }

    addLarva(larva) {
        this._larvae.push(larva);
        this.emit('larvaAdded', larva);
    }

    removeLarva(larvaId) {
        let index = this._larvae.findIndex(larva => larva.id == larvaId);
        if (index != -1) {
            let larvae = this._larvae.splice(index, 1);
            this.emit('larvaRemoved', larvae[0]);
        }
    }

    applyPatch(patch) {
        this._applyProps(patch.props);

        for (let eggJson of patch.eggs.add) {
            let eggVM = EggViewModel.buildFromJson(eggJson);
            this.addEgg(eggVM);
        }
        for (let eggUpdatePatch of patch.eggs.update) {
            let egg = this._eggs.find(egg => egg.id == eggUpdatePatch.id);
            egg.applyPatch(eggUpdatePatch);
        }
        for (let eggId of patch.eggs.remove) {
            this.removeEgg(eggId);
        }

        for (let larvaJson of patch.larvae.add) {
            let larvaVM = LarvaViewModel.buildFromJson(larvaJson);
            this.addLarva(larvaVM);
        }
        for (let larvaUpdatePatch of patch.larvae.update) {
            let larva = this._larvae.find(larva => larva.id == larvaUpdatePatch.id);
            larva.applyPatch(larvaUpdatePatch);
        }
        for (let larvaId of patch.larvae.remove) {
            this.removeLarva(larvaId);
        }
    }

}

export {
    NestViewModel
}