import './style.css'
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nestInlineTmpl from './nestInlineTmpl.html';

class NestInlineView extends BaseGameHTMLView {

    constructor(el, nest) {
        super(el);
        this._nest = nest;

        this._render();

        this._stopListenNesDied = this.$domain.events.on('nestDied', this._onSomeNestDied.bind(this));
        this._nestNameEl.addEventListener('click', this._onNameClick.bind(this));
    }

    get value() {
        return this._nest && !this._nest.isDied ? this._nest : null;
    }

    set value(nest) {
        this._nest = nest;
        this._renderNest();
    }

    remove() {
        super.remove();
        this._stopListenNesDied();
    }

    _render() {
        this._el.innerHTML = nestInlineTmpl;

        this._nestNameEl = this._el.querySelector('[data-nest-name]');
        this._noNestPlaceholderEl = this._el.querySelector('[data-no-nest-placeholder]');
        this._nestDiedErrorEl = this._el.querySelector('[data-nest-died-error-container]');

        this._noNestPlaceholderEl.innerHTML = this.$messages.not_specified;
    }

    _renderNest() {
        this._renderNestName();
        this._renderNestDiedState();
        this._renderNoNestPlaceholderState();
    }

    _renderNoNestPlaceholderState() {
        this._noNestPlaceholderEl.classList.toggle('g-hidden', !!this._nest);
    }

    _renderNestName() {
        this._nestNameEl.classList.toggle('g-hidden', !this._nest);
        this._nestNameEl.innerHTML = this._nest ? this._nest.name : '';
    }

    _renderNestDiedState() {
        this._nestDiedErrorEl.innerHTML = this._nest && this._nest.isDied ? `(${this.$messages.nest_destroyed})` : '';
    }

    _onSomeNestDied(nest) {
        if (this._nest && nest.id == this._nest.id) {
            this._renderNestDiedState();
        }
    }

    _onNameClick() {
        this.$eventBus.emit('showPointRequest', this._nest.position);
    }

}

export {
    NestInlineView
}