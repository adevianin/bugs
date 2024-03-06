import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import eggTabTmpl from './eggTabTmpl.html';
import { EggView } from "./eggView";

class EggTabView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._eggsViews = {};

        this._render();
    }

    _render() {
        this._el.innerHTML = eggTabTmpl;
        this._eggsListEl = this._el.querySelector('[data-eggs-list]');
    }

    manageNest(nest) {
        this._nest = nest;

        console.log('render egg tab view', nest.id);

        this._renderEggPlacesCount();
        this._renderEggsList();
    }

    _renderEggPlacesCount() {
        this._el.querySelector('[data-egg-places-count]').innerHTML = this._nest.eggPlacesCount
    }

    _renderEggsList() {
        this._clearEggsViews();
        for (let egg of this._nest.eggs) {
            let el = document.createElement('tr');
            this._eggsListEl.append(el);
            let view = new EggView(el, egg);
            this._eggsViews[egg.id] = view;
        }
    }

    _clearEggsViews() {
        for (let eggId in this._eggsViews) {
            this._eggsViews[eggId].remove();
        }
    }

}

export {
    EggTabView
}