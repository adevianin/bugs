import { BaseViewModel } from "./baseViewModel";

class RatingContainerViewModel extends BaseViewModel {

    get ratingPlaces() {
        return this._props.rating;
    }

    set ratingPlaces(val) {
        this._props.rating = val;
        this.emit('changed');
    }
}

export {
    RatingContainerViewModel
}