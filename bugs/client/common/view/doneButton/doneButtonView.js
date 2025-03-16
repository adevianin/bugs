import './style.css';
import { BaseHTMLView } from "../base/baseHTMLView";

class DoneButtonView extends BaseHTMLView {

    constructor(el, buttonText, doneStateTime = 3000) {
        super(el);
        this._buttonText = buttonText;
        this._doneStateTime = doneStateTime;

        this._render();

        this._el.addEventListener('click', this._onBtnClick.bind(this));
    }

    addEventListener(eventName, callback) {
        this._el.addEventListener(eventName, callback);
    }

    _render() {
        this._el.classList.add('action-button');
        this._el.textContent = this._buttonText;
    }

    _toogleButtonBack() {
        this._el.classList.remove('action-button--done');
    }

    _toogleButtonForth() {
        this._el.classList.add('action-button--done');
    }

    _onBtnClick() {
        this._toogleButtonForth();

        setTimeout(() => {
            this._toogleButtonBack();
        }, this._doneStateTime);
    }

}

export {
    DoneButtonView
}