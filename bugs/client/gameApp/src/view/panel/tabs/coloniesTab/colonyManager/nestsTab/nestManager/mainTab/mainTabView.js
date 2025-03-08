import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import mainTabTmpl from './mainTabTmpl.html';

class MainTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._nameEl.addEventListener('change', this._onChangedNestName.bind(this));
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderStoredClalories();
        this._renderName();
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
        this._el.innerHTML = mainTabTmpl;

        this._storedCaloriesEl = this._el.querySelector('[data-stored-calories]');
        this._nameEl = this._el.querySelector('[data-name]');
    }

    _renderStoredClalories() {
        this._storedCaloriesEl.innerHTML = this._nest.storedCalories;
    }

    _renderName() {
        this._nameEl.value = this._nest.name;
    }

    _onStoredCaloriesChanged() {
        this._renderStoredClalories();
    }

    async _onChangedNestName() {
        if (!this._nameEl.value) {
            return;
        }
        try {
            await this.$domainFacade.renameNest(this._nest.id, this._nameEl.value);
        } catch (e) {
            console.error(e);
        }
    }

}

export {
    MainTabView
}