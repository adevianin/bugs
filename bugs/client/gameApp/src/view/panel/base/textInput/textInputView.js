import { BaseHTMLView } from "@view/base/baseHTMLView";
import { formatMessage } from "@utils/formatMessage";

class TextInputView extends BaseHTMLView {

    constructor(el, errContainer, minLength=3, maxLength=50) {
        super(el);
        this._minLength = minLength;
        this._maxLength = maxLength;
        this._regex = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9 ]+$/;
        this._errContainer = errContainer;

        this._render();

        this._el.addEventListener('change', this._onChange.bind(this));
    }

    get value() {
        return this._el.value;
    }

    set value(val) {
        this._el.value = val;
    }

    validate() {
        let errorText = this._checkErrors();
        this._renderError(errorText);

        return !errorText;
    }

    _checkErrors() {
        if (this.value.length < this._minLength) {
            return formatMessage(this.$messages.min_str_length, this._minLength);
        }

        if (this.value.length > this._maxLength) {
            return formatMessage(this.$messages.max_str_length, this._maxLength);
        }

        if (!this._regex.test(this.value)) {
            return this.$messages.only_chars_and_digits;
        }

        return null;
    }

    _renderError(errText) {
        this._errContainer.innerHTML = errText || '';
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