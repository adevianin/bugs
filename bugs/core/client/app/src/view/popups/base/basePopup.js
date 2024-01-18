import './style.css';
import popupTemplate from './template.html';
import { BaseHTMLView } from '../../panel/base/baseHTMLView';

class BasePopup extends BaseHTMLView {

    constructor() {
        super(document.createElement('div'));
        this._title = 'popup title';
        this._bodyEl = null;
    }

    render() {
        this._el.classList.add('popup');
        this._el.innerHTML = popupTemplate;

        this._el.querySelector('[data-title]').innerHTML = this._title;

        this._el.querySelector('[data-ok-btn]').addEventListener('click', this.onOk.bind(this));
        this._el.querySelector('[data-cancel-btn]').addEventListener('click', this.onCancel.bind(this));
    }

    get bodyEl() {
        if (!this._bodyEl) {
            this._bodyEl = this._el.querySelector('[data-popup-body]');
        }

        return this._bodyEl;
    }

    close() {
        this.remove();
    }

    onOk() {
    }

    onCancel() {
    }

}

export {
    BasePopup
}