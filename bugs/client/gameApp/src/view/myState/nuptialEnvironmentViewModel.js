import { BaseViewModel } from "./baseViewModel";
import { SpecieViewModel } from "./specieViewModel";

class NuptialEnvironmentViewModel extends BaseViewModel {

    static buildFromJson(json) {
        let queens = json.queens;
        delete json.queens;

        let specie = SpecieViewModel.buildFromJson(json.specie);
        delete json.specie;

        return new NuptialEnvironmentViewModel(json, queens, specie);
    }

    constructor(json, queens, specie) {
        super(json);
        this._queens = queens;
        this._specie = specie;
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

    get specie() {
        return this._specie;
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

        this._specie.applyPatch(patch.specie);
    }

}

export {
    NuptialEnvironmentViewModel
}
