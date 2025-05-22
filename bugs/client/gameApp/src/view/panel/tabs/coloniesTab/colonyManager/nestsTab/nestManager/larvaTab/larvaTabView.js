import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import larvaTabTmpl from './larvaTabTmpl.html';
import { LarvaView } from "./larvaView";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class LarvaTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._larvaeViews = {};

        this._render();
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderLarvaeList();
        this._renderNoLarvaeState();
    }

    _listenNest() {
        this._stopListenLarvaRemoved = this._nest.on('larvaRemoved', this._onLarvaRemoved.bind(this));
        this._stopListenLarvaAdded = this._nest.on('larvaAdded', this._onLarvaAdded.bind(this));
    }

    _stopListenNest() {
        if (!this._nest) {
            return
        }
        this._stopListenLarvaRemoved();
        this._stopListenLarvaAdded();
    }

    _render() {
        this._el.innerHTML = larvaTabTmpl;

        this._larvaeListEl = this._el.querySelector('[data-larvae-list]');
        this._noLarvaPlaceholder = this._el.querySelector('[data-no-larva-placeholder]');

        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_TITLE);
        this._el.querySelector('[data-col-title-name]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_NAME);
        this._el.querySelector('[data-col-title-progress]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_PROGRESS);
        this._el.querySelector('[data-col-title-caste]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_CASTE);
        this._el.querySelector('[data-col-title-actions]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_ACTIONS);
        this._el.querySelector('[data-no-larva-placeholder-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_NO_LARVA_LABEL);
    }

    _renderNoLarvaeState() {
        let isEmpty = true;
        for (let larva of this._nest.larvae) {
            if (!larva.isMarkedAsRemoving()) {
                isEmpty = false;
                break;
            }
        }
        this._noLarvaPlaceholder.classList.toggle('g-hidden', !isEmpty);
    }

    _renderLarvaeList() {
        this._clearLarvaeList();
        for (let larva of this._nest.larvae) {
            this._renderLarva(larva);
        }
    }

    _renderLarva(larva) {
        let el = document.createElement('tr');
        this._larvaeListEl.append(el);
        let view = new LarvaView(el, larva, this._nest);
        view.events.on('removeRequest', () => this._onLarvaRemoveRequest(larva));
        this._larvaeViews[larva.id] = view;
    }

    _clearLarvaeList() {
        for (let larvaeId in this._larvaeViews) {
            this._larvaeViews[larvaeId].remove();
        }
        this._larvaeViews = {};
    }

    _onLarvaRemoved(larva) {
        this._removeLarvaView(larva);
        this._renderNoLarvaeState();
    }

    _removeLarvaView(larva) {
        this._larvaeViews[larva.id].remove();
        delete this._larvaeViews[larva.id];
    }

    _onLarvaAdded(larva) {
        this._renderLarva(larva);
        this._renderNoLarvaeState();
    }

    _onLarvaRemoveRequest(larva) {
        larva.markAsRemoving();
        this._larvaeViews[larva.id].toggle(false);
        this.$domain.deleteLarvaInNest(this._nest.id, larva.id);
        this._renderNoLarvaeState();
    }

}

export {
    LarvaTabView
}