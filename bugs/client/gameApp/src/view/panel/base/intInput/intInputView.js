import "./style.css";
import { BaseHTMLView } from "@view/base/baseHTMLView";

class IntInputView extends BaseHTMLView {

    constructor(el, minValue, maxValue, errContainerEl) {
        super(el);
        this._min = parseInt(minValue);
        this._max = parseInt(maxValue);
        this._errContainerEl = errContainerEl;

        this._el.addEventListener('change', this._onChange.bind(this));

        this._render();
    }

    get value() {
        return parseInt(this._el.value);
    }

    set value(val) {
        this._el.value = parseInt(val);
    }

    get _hasMin() {
        return !isNaN(this._min);
    }

    get _hasMax() {
        return !isNaN(this._max);
    }

    get _errorText() {
        if (this._hasMin && this._hasMax) {
            return `(${this.$messages.min} ${this._min}, ${this.$messages.max} ${this._max})`;
        } else if (this._hasMin && !this._hasMax) {
            return `(${this.$messages.min} ${this._min})`;
        } else if (!this._hasMin && this._hasMax) {
            return `(${this.$messages.max} ${this._max})`;
        } else {
            return '';
        }
    }

    validate() {
        let isValid = this._checkIsValidate();
        if (isValid) {
            this._hideError();
        } else {
            this._showError();
        }

        return isValid;
    }

    _checkIsValidate() {
        let value = this.value;

        if (isNaN(value)) {
            return false;
        }

        if (this._hasMin && value < this._min) {
            return false;
        }

        if (this._hasMax && value > this._max) {
            return false;
        }

        return true;
    }

    _render() {
        this._el.classList.add('number-field');
        this._el.setAttribute('type', 'number');
        this._el.setAttribute('min', this._min);
        this._el.setAttribute('max', this._max);

        this._errContainerEl.classList.add('number-field__error-text');

        this._el.value = this._hasMin ? this._min : 0;
    }

    _showError() {
        this._el.classList.add('number-field--error');
        this._errContainerEl.innerHTML = this._errorText;
    }

    _hideError() {
        this._el.classList.remove('number-field--error');
        this._errContainerEl.innerHTML = '';
    }

    _onChange() {
        this._el.value = parseInt(this._el.value);
        this.validate();
        this.events.emit('change');
    }

}

export {
    IntInputView
}