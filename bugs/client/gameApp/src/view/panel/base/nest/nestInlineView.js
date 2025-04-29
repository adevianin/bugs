import './style.css'
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nestInlineTmpl from './nestInlineTmpl.html';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class NestInlineView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._nestData = null;
        this._isNestDied = false;

        this._render();

        this._stopListenNestDied = this.$domain.events.on('worldStepEvent:nestDied', this._onSomeNestDied.bind(this));
        this._nestNameEl.addEventListener('click', this._onNameClick.bind(this));
    }

    setNestData(nestData) {
        this._nestData = nestData;
        this._isNestDied = nestData.isDied;
        this._renderNest();
    }

    remove() {
        super.remove();
        this._stopListenNestDied();
    }

    _render() {
        this._el.innerHTML = nestInlineTmpl;

        this._nestNameEl = this._el.querySelector('[data-nest-name]');
        this._noNestPlaceholderEl = this._el.querySelector('[data-no-nest-placeholder]');
        this._nestDiedErrorEl = this._el.querySelector('[data-nest-died-error-container]');

        this._noNestPlaceholderEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_INLINE_NOT_SPECIFIED);
    }

    _renderNest() {
        this._renderNestName();
        this._renderNestDiedState();
        this._renderNoNestPlaceholderState();
    }

    _renderNoNestPlaceholderState() {
        this._noNestPlaceholderEl.classList.toggle('g-hidden', !!this._nestData);
    }

    _renderNestName() {
        this._nestNameEl.classList.toggle('g-hidden', !this._nestData);
        this._nestNameEl.innerHTML = this._nestData ? this._nestData.name : '';
    }

    _renderNestDiedState() {
        this._nestDiedErrorEl.innerHTML = this._isNestDied ? `(${this.$mm.get(GAME_MESSAGE_IDS.NEST_INLINE_DESTROYED)})` : '';
    }

    _onSomeNestDied({nestId}) {
        if (this._nestData && nestId == this._nestData.id) {
            this._isNestDied = true;
            this._renderNestDiedState();
        }
    }

    _onNameClick(e) {
        e.preventDefault();
        this.$eventBus.emit('showPointRequest', this._nestData.position);
    }

}

export {
    NestInlineView
}