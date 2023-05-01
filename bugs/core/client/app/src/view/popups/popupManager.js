import { TownPopup } from './town/townPopup';

class PopupManager {

    constructor(el) {
        this._el = el;
    }

    openTownPopup(town) {
        let popup = new TownPopup(town);
        this._showPopup(popup);
    }

    _showPopup(popup) {
        this._el.innerHTML = '';
        this._el.appendChild(popup.el);
    }
}

export {
    PopupManager
}