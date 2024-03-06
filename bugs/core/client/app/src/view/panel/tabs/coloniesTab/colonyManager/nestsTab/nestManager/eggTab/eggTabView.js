import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import eggTabTmpl from './eggTabTmpl.html';
import { EggView } from "./eggView";

class EggTabView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._eggsViews = {};

        this._render();

        this._addEggBtn.addEventListener('click', this._onAddEggBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = eggTabTmpl;
        this._eggsListEl = this._el.querySelector('[data-eggs-list]');
        this._addEggBtn = this._el.querySelector('[data-add-egg]');
        this._nameInput = this._el.querySelector('[data-egg-name]');
        this._isFertilizeCheckbox = this._el.querySelector('[data-is-fertilized]');
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderEggPlacesCount();
        this._renderEggsList();
    }

    _listenNest() {
        this._stopListenEggBecameLarva = this._nest.on('eggBecameLarva', this._onEggBecameLarva.bind(this));
        this._stopListenEggAdded = this._nest.on('eggAdded', this._onEggAdded.bind(this));
    }

    _stopListenNest() {
        if (!this._nest) {
            return
        }

        this._stopListenEggBecameLarva();
        this._stopListenEggAdded();
    }

    _renderEggPlacesCount() {
        this._el.querySelector('[data-egg-places-count]').innerHTML = this._nest.eggPlacesCount
    }

    _renderEggsList() {
        this._clearEggsViews();
        for (let egg of this._nest.eggs) {
            this._renderEgg(egg);
        }
    }

    _renderEgg(egg) {
        let el = document.createElement('tr');
        this._eggsListEl.append(el);
        let view = new EggView(el, egg);
        this._eggsViews[egg.id] = view;
    }

    _clearEggsViews() {
        for (let eggId in this._eggsViews) {
            this._eggsViews[eggId].remove();
        }
        this._eggsViews = {};
    }

    _onEggBecameLarva(egg) {
        this._eggsViews[egg.id].remove();
        delete this._eggsViews[egg.id];
    }

    _onEggAdded(egg) {
        this._renderEgg(egg);
    }

    _onAddEggBtnClick() {
        let name = this._nameInput.value;
        let isFertilized = this._isFertilizeCheckbox.checked;
        if (name.length > 3) {
            this._nest.addNewEgg(name, isFertilized);
        }
    }

}

export {
    EggTabView
}