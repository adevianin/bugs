import { EventEmitter } from "@common/utils/eventEmitter";

class RatingContainer extends EventEmitter {

    get ratingPlaces() {
        return this._ratingPlaces;
    }

    setRatingPlaces(ratingPlaces) {
        this._ratingPlaces = ratingPlaces;
        this.emit('changed');
    }
}

export {
    RatingContainer
}