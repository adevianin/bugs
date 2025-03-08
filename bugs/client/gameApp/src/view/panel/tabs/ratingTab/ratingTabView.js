import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import ratingTabTmpl from './ratingTabTmpl.html';
import ratingPlaceTmpl from './ratingPlaceTmpl.html';

class RatingTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._ratingContainer = this.$domainFacade.ratingContainer;

        this._ratingContainer.on('changed', this._onRatingChanged.bind(this));

        this._render();
    }

    _render() {
        this._el.innerHTML = ratingTabTmpl;

        this._ratingPlacesListEl = this._el.querySelector('[data-rating-places-list]');

        for (let ratingPlace of this._ratingContainer.ratingPlaces) {
            this._renderRatinPlace(ratingPlace);
        }
    }

    _renderRatinPlace(ratingPlace) {
        let tr = document.createElement('tr');
        tr.innerHTML = ratingPlaceTmpl;
        tr.querySelector('[data-place-number]').innerHTML = ratingPlace.place;
        tr.querySelector('[data-username]').innerHTML = ratingPlace.username;
        tr.querySelector('[data-ants-count]').innerHTML = ratingPlace.ants;
        tr.querySelector('[data-colonies-count]').innerHTML = ratingPlace.colonies;
        this._ratingPlacesListEl.append(tr);
    }

    _onRatingChanged() {
        this._render();
    }

}

export {
    RatingTabView
}