import './style.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class TextInputView extends BaseGameHTMLView {

    constructor(el, errContainer, minLength=3, maxLength=50, doValidationOnChange=true) {
        super(el);
        this._minLength = minLength;
        this._maxLength = maxLength;
        this._regex = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9 ]+$/;
        this._errContainer = errContainer;

        this._render();

        if (doValidationOnChange) {
            this._el.addEventListener('change', this._onChange.bind(this));
        }
    }

    get value() {
        return this._el.value.trim();
    }

    set value(val) {
        this._el.value = val;
    }

    validate() {
        let errorText = this._checkErrors();
        this._renderError(errorText);

        return !errorText;
    }

    clearErr() {
        this._renderError(null);
    }

    _checkErrors() {
        if (this.value.length < this._minLength) {
            return this.$mm.format(GAME_MESSAGE_IDS.TEXT_INPUT_MIN_STR_LENGTH, this._minLength);
        }

        if (this.value.length > this._maxLength) {
            return this.$mm.format(GAME_MESSAGE_IDS.TEXT_INPUT_MAX_STR_LENGTH, this._maxLength);
        }

        if (!this._regex.test(this.value)) {
            return this.$mm.get(GAME_MESSAGE_IDS.TEXT_INPUT_INVALID_CHAR);
        }

        return null;
    }

    _renderError(errText) {
        this._errContainer.innerHTML = errText || '';
        this._el.classList.toggle('text-input--error', !!errText);
    }

    _render() {
        this._el.setAttribute('type', 'text');
        this._el.setAttribute('minlength', this._minLength);
        this._el.setAttribute('maxlength', this._maxLength);
    }

    _onChange() {
        this.validate();
    }
}

export {
    TextInputView
}