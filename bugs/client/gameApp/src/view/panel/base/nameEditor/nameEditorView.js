import './styles.css';
import nameEditorTmpl from './nameEditorTmpl.html';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { throttle } from "@common/utils/throttle";
import { UI_CONSTS } from '@common/view/ui_consts';
import { TextInputView } from '../textInput/textInputView';
import { CONSTS } from '@domain/consts';

class NameEditorView extends BaseGameHTMLView {

    static MODES = {
        EDIT: 'edit',
        PREVIEW: 'preview'
    }

    constructor(el, nameApplier, name='') {
        super(el);
        this._nameApplier = nameApplier;
        this._name = name;

        this._render();

        this._editBtn.addEventListener('click', this._onEditBtnClick.bind(this));
        this._cancelBtn.addEventListener('click', this._onCancelBtnClick.bind(this));
        this._okBtn.addEventListener('click', throttle(this._onOkBtnClick.bind(this), UI_CONSTS.DOUBLE_CLICK_THROTTLE_MS));
    }

    get name() {
        return this._name;
    }

    set name(val) {
        this._name = val;
        this._stopEditing();
        this._renderName();
    }

    remove() {
        super.remove();
        this._textInputView.remove();
        this._loader.remove();
    }

    _render() {
        this._el.innerHTML = nameEditorTmpl;

        this._previewContainerEl = this._el.querySelector('[data-preview-container]')
        this._editContainerEl = this._el.querySelector('[data-edit-container]')

        this._namePreviewEl = this._el.querySelector('[data-name-preview]');

        let nameInput = this._el.querySelector('[data-name]');
        let nameErrContainer = this._el.querySelector('[data-err-container]');
        this._textInputView = new TextInputView(nameInput, nameErrContainer, CONSTS.MIN_NAME_LENGTH, CONSTS.MAX_NAME_LENGTH, false);

        this._okBtn = this._el.querySelector('[data-ok]');
        this._cancelBtn = this._el.querySelector('[data-cancel]');
        this._editBtn = this._el.querySelector('[data-edit]');

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        if (this._name) {
            this._renderName();
        }

        this._changeMode(NameEditorView.MODES.PREVIEW);
    }

    _changeMode(mode) {
        this._previewContainerEl.classList.toggle('g-hidden', mode != NameEditorView.MODES.PREVIEW);
        this._editContainerEl.classList.toggle('g-hidden', mode != NameEditorView.MODES.EDIT);
    }

    _renderName() {
        this._namePreviewEl.innerHTML = this._name;
        this._textInputView.value = this._name
    }

    _stopEditing() {
        this._textInputView.value = this._name;
        this._textInputView.clearErr();
        this._changeMode(NameEditorView.MODES.PREVIEW);
    }

    _onEditBtnClick() {
        this._changeMode(NameEditorView.MODES.EDIT);
    }

    _onCancelBtnClick() {
        this._stopEditing();
        this.events.emit('editCanceled');
    }

    async _onOkBtnClick() {
        if (!this._textInputView.validate()) {
            return;
        }

        let value = this._textInputView.value;
        let isAppliedSuccessfully = null;
        if (this._nameApplier) {
            this._loader.toggle(true);
            isAppliedSuccessfully = await this._nameApplier(value);
            this._loader.toggle(false);
        }
        if (isAppliedSuccessfully || !this._nameApplier) {
            this._name = value;
            this._renderName();
            this._changeMode(NameEditorView.MODES.PREVIEW);
            this.events.emit('editDone');
        }
    }
}

export {
    NameEditorView
}