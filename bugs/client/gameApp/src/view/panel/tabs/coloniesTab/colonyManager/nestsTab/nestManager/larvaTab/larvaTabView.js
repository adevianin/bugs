import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import larvaTabTmpl from './larvaTabTmpl.html';
import { LarvaView } from "./larvaView";

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
    }

    _removeLarvaView(larva) {
        this._larvaeViews[larva.id].remove();
        delete this._larvaeViews[larva.id];
    }

    _onLarvaAdded(larva) {
        this._renderLarva(larva);
    }

    remove() {
        this._stopListenNest();
    }

}

export {
    LarvaTabView
}