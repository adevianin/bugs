import { BaseViewModel } from "./baseViewModel";

class OperationViewModel extends BaseViewModel {

    get id() {
        return this._props.id;
    }

    get name() {
        return this._props.name;
    }

    get status() {
        return this._props.status;
    }

    set status(val) {
        this._props.status = val;
        this.emit('changed');
    }

    get markers() {
        return this._props.markers;
    }

    get workerVacanciesCount() {
        return this._props.workerVacanciesCount;
    }

    get warriorVacanciesCount() {
        return this._props.warriorVacanciesCount;
    }

    get hiredWorkersCount() {
        return this._props.hiredWorkersCount;
    }

    set hiredWorkersCount(val) {
        this._props.hiredWorkersCount = val;
        this.emit('changed');
    }

    get hiredWarriorsCount() {
        return this._props.hiredWarriorsCount;
    }

    set hiredWarriorsCount(val) {
        this._props.hiredWarriorsCount = val;
        this.emit('changed');
    }

    applyPatch(patch) {
        this._applyProps(patch.props);
    }

}

export {
    OperationViewModel
}