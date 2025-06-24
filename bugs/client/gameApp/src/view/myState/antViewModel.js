import { EntityViewModel } from "./entityViewModel"

class AntViewModel extends EntityViewModel {

    get name() {
        return this._props.name;
    }

    get antType() {
        return this._props.antType;
    }

    get stats() {
        return this._props.stats;
    }

    get genome() {
        return this._props.genome;
    }

    get birthStep() {
        return this._props.birthStep;
    }

    get currentActivity() {
        return this._props.currentActivity;
    }

    set currentActivity(val) {
        this._props.currentActivity = val;
        this.emit('currentActivityChanged');
    }

    get isHungry() {
        return this._props.isHungry;
    }

    set isHungry(val) {
        this._props.isHungry = val;
        this.emit('isHungryChanged');
    }

    get homeNestId() {
        return this._props.homeNestId;
    }

    set homeNestId(val) {
        this._props.homeNestId = val;
        this.emit('homeNestIdChanged');
        this.$eventBus.emit('antChangedHomeNest', this);
    }

    get guardianBehavior() {
        return this._props.guardianBehavior;
    }

    set guardianBehavior(val) {
        this._props.guardianBehavior = val;
    }

    get isCooperativeBehavior() {
        return this._props.isCooperativeBehavior;
    }

    set isCooperativeBehavior(val) {
        this._props.isCooperativeBehavior = val;
    }

    get canBeCooperative() {
        return this._props.canBeCooperative;
    }

    get canBeGuardian() {
        return this._props.canBeGuardian;
    }

    get isQueenOfColony() {
        return this._props.isQueenOfColony;
    }

    set isQueenOfColony(val) {
        this._props.isQueenOfColony = val;
    }

    get canFlyNuptialFlight() {
        return this._props.canFlyNuptialFlight;
    }

    set canFlyNuptialFlight(val) {
        this._props.canFlyNuptialFlight = val;
    }

    get breedingMaleGenome() {
        return this._props.breedingMaleGenome;
    }

    set breedingMaleGenome(val) {
        this._props.breedingMaleGenome = val;
    }

}

export {
    AntViewModel
}