import { BaseViewModel } from "./baseViewModel";
import { OperationViewModel } from "./operationViewModel";

class ColonyViewModel extends BaseViewModel {

    static buildFromJson(json) {
        let operations = [];
        for (let operationJson of json.operations) {
            operations.push(OperationViewModel.buildFromJson(operationJson));
        }
        delete json.operations;

        return new ColonyViewModel(json, operations);
    }

    get id() {
        return this._props.id;
    }

    get name() {
        return this._props.name;
    }

    get operations() {
        return this._operations;
    }

    get enemies() {
        return this._props.enemies;
    }

    constructor(json, operations) {
        super(json);
        this._operations = operations;
    }

    addOperation(operation) {
        this._operations.push(operation);
        this.emit('operationAdded', operation);
    }

    removeOperation(operationId) {
        let index = this._operations.findIndex(o => o.id == operationId);
        if (index != -1) {
            let operations = this._operations.splice(index, 1);
            this.emit('operationRemoved', operations[0]);
        }
    }

    applyPatch(patch) {
        this._applyProps(patch.props);

        for (let operationJson of patch.operations.add) {
            let operationVM = OperationViewModel.buildFromJson(operationJson);
            this.addOperation(operationVM);
        }
        for (let operationUpdatePatch of patch.operations.update) {
            let o = this._operations.find(o => o.id == operationUpdatePatch.id);
            o.applyPatch(operationUpdatePatch);
        }
        for (let operationId of patch.operations.remove) {
            this.removeOperation(operationId);
        }
    }

}

export {
    ColonyViewModel
}