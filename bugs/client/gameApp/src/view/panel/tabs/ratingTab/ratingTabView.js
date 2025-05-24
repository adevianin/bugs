import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import ratingTabTmpl from './ratingTabTmpl.html';
import ratingPlaceTmpl from './ratingPlaceTmpl.html';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { PanelTabHeadView } from '@view/panel/panelTabHead/panelTabHeadView';
import arrowToRightSvgTmpl from '@view/panel/svg/arrowToRight.html';
import arrowToLeftSvgTmpl from '@view/panel/svg/arrowToLeft.html';

class RatingTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._ratingContainer = this.$domain.ratingContainer;
        this._currentPortionIndex = 0;
        this._portionSize = 10;

        this._render();

        this._ratingContainer.on('changed', this._onRatingChanged.bind(this));
        this._prevBtn.addEventListener('click', this._onPrevBtnClick.bind(this));
        this._nextBtn.addEventListener('click', this._onNextBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = ratingTabTmpl;

        this._ratingPlacesListEl = this._el.querySelector('[data-rating-places-list]');

        this._prevBtn = this._el.querySelector('[data-prev]');
        this._prevBtn.innerHTML = arrowToLeftSvgTmpl;
        this._nextBtn = this._el.querySelector('[data-next]');
        this._nextBtn.innerHTML = arrowToRightSvgTmpl;

        this._renderCurrentPortion();
        this._renderBtnsState();

        let tabName = this.$mm.get(GAME_MESSAGE_IDS.RATING_TAB_TITLE);
        this._tabHeadView = new PanelTabHeadView(this._el.querySelector('[data-tab-head]'), tabName);

        this._el.querySelector('[data-col-title-place]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_PLACE);
        this._el.querySelector('[data-col-title-username]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_USERNAME);
        this._el.querySelector('[data-col-title-ants-count]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_ANTS_COUNT);
        this._el.querySelector('[data-col-title-colonies-count]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_COLONIES_COUNT);
    }

    _renderCurrentPortion() {
        this._ratingPlacesListEl.innerHTML = '';
        let startIndex = this._currentPortionIndex * this._portionSize;
        let endIndex = startIndex + this._portionSize;

        let places = this._ratingContainer.ratingPlaces.slice(startIndex, endIndex);
        for (let place of places) {
            this._renderRatingPlace(place);
        }
    }

    _renderRatingPlace(ratingPlace) {
        let tr = document.createElement('tr');
        tr.classList.add('rating-tab__username-container');
        tr.innerHTML = ratingPlaceTmpl;
        tr.querySelector('[data-place-number]').innerHTML = ratingPlace.place;
        tr.querySelector('[data-username]').innerHTML = ratingPlace.username;
        tr.querySelector('[data-ants-count]').innerHTML = ratingPlace.ants;
        tr.querySelector('[data-colonies-count]').innerHTML = ratingPlace.colonies;
        this._ratingPlacesListEl.append(tr);
    }

    _renderBtnsState() {
        this._prevBtn.disabled = this._currentPortionIndex == 0;
        this._nextBtn.disabled = (this._currentPortionIndex + 1) * this._portionSize >= this._ratingContainer.ratingPlaces.length
    }

    _onPrevBtnClick() {
        this._currentPortionIndex--;
        this._renderCurrentPortion();
        this._renderBtnsState();
    }

    _onNextBtnClick() {
        this._currentPortionIndex++;
        this._renderCurrentPortion();
        this._renderBtnsState();
    }

    _onRatingChanged() {
        this._render();
    }

}

export {
    RatingTabView
}