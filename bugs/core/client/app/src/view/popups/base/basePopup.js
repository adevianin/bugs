import './style.css';
import popupTemplate from './template.html';

class BasePopup {

    constructor() {
        this._title = 'popup title';
        this.el = document.createElement('div');
        this._bodyEl = null;
    }

    render() {
        this.el.classList.add('popup');
        this.el.innerHTML = popupTemplate;

        this.el.querySelector('[data-title]').innerHTML = this._title;

        this.el.querySelector('[data-ok-btn]').addEventListener('click', this.onOk.bind(this));
        this.el.querySelector('[data-cancel-btn]').addEventListener('click', this.onCancel.bind(this));
    }

    get bodyEl() {
        if (!this._bodyEl) {
            this._bodyEl = this.el.querySelector('[data-popup-body]');
        }

        return this._bodyEl;
    }

    close() {
        this.el.remove();
    }

    onOk() {
    }

    onCancel() {
    }

}

export {
    BasePopup
}