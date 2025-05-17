import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import mainTabTmpl from './mainTabTmpl.html';
import { NameEditorView } from '@view/panel/base/nameEditor/nameEditorView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class MainTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderStoredClalories();
        this._nameEditor.name = nest.name;
        this._renderIsMainNest();
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
        this._nameEditor = new NameEditorView(this._el.querySelector('[data-name-editor]'), this._applyNestName.bind(this));
        this._isMainNestEl = this._el.querySelector('[data-is-main-nest]');

        this._el.querySelector('[data-name-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_NAME_LABEL);
        this._el.querySelector('[data-food-count-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_FOOD_COUNT_LABEL);
        this._el.querySelector('[data-is-main-nest-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_IS_NEST_MAIN_LABEL);
    }

    _renderStoredClalories() {
        this._storedCaloriesEl.innerHTML = this._nest.storedCalories;
    }

    _renderIsMainNest() {
        this._isMainNestEl.innerHTML = this._nest.isMain ? '+' : '-';
    }

    _onStoredCaloriesChanged() {
        this._renderStoredClalories();
    }

    async _applyNestName(newName) {
        await this.$domain.renameNest(this._nest.id, newName);
        return true;
    }

}

export {
    MainTabView
}