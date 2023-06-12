import { NestPopup } from './nest/nestPopup';

class PopupManager {

    constructor(el) {
        this._el = el;
    }

    openNestPopup(nest) {
        let popup = new NestPopup(nest);
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