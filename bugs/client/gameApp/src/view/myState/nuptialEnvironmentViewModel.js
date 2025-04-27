import { BaseViewModel } from "./baseViewModel";

class NuptialEnvironmentViewModel extends BaseViewModel {

    static buildFromJson(json) {
        let queens = json.queens;
        delete json.queens;
        return new NuptialEnvironmentViewModel(json, queens);
    }

    constructor(json, queens) {
        super(json);
        this._queens = queens;
    }

    get queenIds() {
        return this._queens;
    }

    get males() {
        return this._props.males;
    }

    set males(val) {
        this._props.males = val;
        this.emit('nuptialMalesChanged', this._props.males);
    }

    addQueen(queenId) {
        this._queens.push(queenId);
        this.emit('queenFlewIn', queenId);
    }

    removeQueen(queenId) {
        let index = this._queens.findIndex(qId => qId == queenId);
        if (index != -1) {
            this._queens.splice(index, 1);
            this.emit('queenFlewOut', queenId);
        }
    }

    applyPatch(patch) {
        this._applyProps(patch.props);

        for (let queenId of patch.queens.add) {
            this.addQueen(queenId);
        }
        for (let queenId of patch.queens.remove) {
            this.removeQueen(queenId);
        }
    }

}

export {
    NuptialEnvironmentViewModel
}
