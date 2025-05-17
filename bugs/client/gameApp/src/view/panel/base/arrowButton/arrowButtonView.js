import './style.css';
import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import toRightTmpl from './toRightTmpl.html';
import toLeftTmpl from './toLeftTmpl.html';

class ArrowButtonView extends BaseGameHTMLView {

    constructor (btnEl, isRight = false) {
        super(btnEl);
        this._isRight = isRight;

        this._render();

        this._el.addEventListener('click', this._onClick.bind(this));
    }

    _render() {
        this._el.classList.add('arrow-btn');
        this._el.innerHTML = this._isRight ? toRightTmpl : toLeftTmpl;
    }

    toggleIsDisabled(isDisabled) {
        this._el.disabled = isDisabled;
    }

    _onClick() {
        this.events.emit('click');
    }
}

export {
    ArrowButtonView
}