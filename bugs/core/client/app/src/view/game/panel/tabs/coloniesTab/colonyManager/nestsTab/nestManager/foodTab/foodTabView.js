import { BaseHTMLView } from "@view/base/baseHTMLView";
import foodTabTmpl from './foodTabTmpl.html';

class FoodTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderStoredClalories();
    }

    remove() {
        super.remove();
        this._stopListenNest();
    }

    _listenNest() {
        this._stopListenStoredCaloriesChanged = this._nest.on('storedCaloriesChanged', this._onStoredCaloriesChanged.bind(this));
    }

    _stopListenNest() {
        if (!this._nest) {
            return
        }

        this._stopListenStoredCaloriesChanged();
    }

    _render() {
        this._el.innerHTML = foodTabTmpl;

        this._storedCaloriesEl = this._el.querySelector('[data-stored-calories]');
    }

    _renderStoredClalories() {
        this._storedCaloriesEl.innerHTML = this._nest.storedCalories;
    }

    _onStoredCaloriesChanged() {
        this._renderStoredClalories();
    }

}

export {
    FoodTabView
}