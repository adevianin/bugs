import './styles.css';
import nameEditorTmpl from './nameEditorTmpl.html';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { TextInputView } from '../textInput/textInputView';
import { CONSTS } from '@domain/consts';
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import editSVG from '@view/panel/svg/edit.html';
import okSVG from '@view/panel/svg/ok.html';
import cancelSVG from '@view/panel/svg/cancel.html';

class NameEditorView extends BaseGameHTMLView {

    static MODES = {
        EDIT: 'edit',
        PREVIEW: 'preview'
    }

    constructor(el, nameApplier, name='', waitApplier=false) {
        super(el);
        this._nameApplier = nameApplier;
        this._name = name;
        this._waitApplier = waitApplier;

        this._render();

        this._editBtn.addEventListener('click', this._onEditBtnClick.bind(this));
        this._cancelBtn.addEventListener('click', this._onCancelBtnClick.bind(this));
        this._okBtn.addEventListener('click', doubleClickProtection(this._onOkBtnClick.bind(this)));
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
        this._el.classList.add('name-editor');

        this._previewContainerEl = this._el.querySelector('[data-preview-container]');
        this._editContainerEl = this._el.querySelector('[data-edit-container]');

        this._namePreviewEl = this._el.querySelector('[data-name-preview]');

        let nameInput = this._el.querySelector('[data-name]');
        let nameErrContainer = this._el.querySelector('[data-err-container]');
        this._textInputView = new TextInputView(nameInput, nameErrContainer, CONSTS.MIN_NAME_LENGTH, CONSTS.MAX_NAME_LENGTH, false);

        this._okBtn = this._el.querySelector('[data-ok]');
        this._okBtn.innerHTML = okSVG;
        this._cancelBtn = this._el.querySelector('[data-cancel]');
        this._cancelBtn.innerHTML = cancelSVG;
        this._editBtn = this._el.querySelector('[data-edit]');
        this._editBtn.innerHTML = editSVG;

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));
        if (!this._waitApplier) {
            this._loader.toggle(false);
        }

        if (this._name) {
            this._renderName();
        }

        this._changeMode(NameEditorView.MODES.PREVIEW);
    }

    _changeMode(mode) {
        this._previewContainerEl.classList.toggle('g-hidden', mode != NameEditorView.MODES.PREVIEW);
        this._editContainerEl.classList.toggle('g-hidden', mode != NameEditorView.MODES.EDIT);
        this.events.emit('modeChanged', mode);
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
        this._textInputView.focus();
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
            if (this._waitApplier) {
                this._loader.toggleVisibility(true);
                isAppliedSuccessfully = await this._nameApplier(value);
                this._loader.toggleVisibility(false);
            } else {
                this._nameApplier(value);
                isAppliedSuccessfully = true;
            }
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