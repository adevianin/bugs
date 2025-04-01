import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import mainTabTmpl from './mainTabTmpl.html';
import { NameEditorView } from '@view/panel/base/nameEditor/nameEditorView';

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
    }

    _renderStoredClalories() {
        this._storedCaloriesEl.innerHTML = this._nest.storedCalories;
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