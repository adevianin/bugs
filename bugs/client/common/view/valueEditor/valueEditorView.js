import './styles.css';
import { BaseHTMLView } from "../base/baseHTMLView";
import valueEditorTmpl from './valueEditorTmpl.html';
import { DotsLoaderView } from "../dotsLoader/dotsLoaderView";
import { throttle } from "@common/utils/throttle";
import { UI_CONSTS } from "../ui_consts";

class ValueEditorView extends BaseHTMLView {

    static MODES = {
        EDIT: 'edit',
        PREVIEW: 'preview'
    }

    constructor(el, value = '', valueApplier, inputType = 'text') {
        super(el);
        this._inputType = inputType;
        this._value = value;
        this._valueApplier = valueApplier;

        this._render();

        this._editBtn.addEventListener('click', this._onEditBtnClick.bind(this));
        this._cancelBtn.addEventListener('click', this._onCancelBtnClick.bind(this));
        this._okBtn.addEventListener('click', throttle(this._onOkBtnClick.bind(this), UI_CONSTS.DOUBLE_CLICK_THROTTLE_MS));
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this._renderValue();
    }

    _render() {
        this._el.innerHTML = valueEditorTmpl;

        this._previewContainerEl = this._el.querySelector('[data-preview-container]')
        this._editContainerEl = this._el.querySelector('[data-edit-container]')

        this._valuePreviewEl = this._el.querySelector('[data-value-preview]');

        this._inputEl = this._el.querySelector('[data-input]');
        this._inputEl.setAttribute('type', this._inputType);

        this._okBtn = this._el.querySelector('[data-ok]');
        this._cancelBtn = this._el.querySelector('[data-cancel]');
        this._editBtn = this._el.querySelector('[data-edit]');

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._renderValue();
        this._changeMode(ValueEditorView.MODES.PREVIEW);
    }

    _changeMode(mode) {
        this._previewContainerEl.classList.toggle('g-hidden', mode != ValueEditorView.MODES.PREVIEW);
        this._editContainerEl.classList.toggle('g-hidden', mode != ValueEditorView.MODES.EDIT);
    }

    _renderValue() {
        this._inputEl.value = this._value;
        this._valuePreviewEl.innerHTML = this._value;
    }

    _onEditBtnClick() {
        this._changeMode(ValueEditorView.MODES.EDIT);
    }

    _onCancelBtnClick() {
        this._inputEl.value = this._value;
        this._changeMode(ValueEditorView.MODES.PREVIEW);
        this.events.emit('editCanceled');
    }

    async _onOkBtnClick() {
        let value = this._inputEl.value;
        let isAppliedSuccessfully = null;
        if (this._valueApplier) {
            this._loader.toggle(true);
            isAppliedSuccessfully = await this._valueApplier(value);
            this._loader.toggle(false);
        }
        if (isAppliedSuccessfully || !this._valueApplier) {
            this._value = value;
            this._renderValue();
            this._changeMode(ValueEditorView.MODES.PREVIEW);
            this.events.emit('editDone');
        }
    }
}

export {
    ValueEditorView
}