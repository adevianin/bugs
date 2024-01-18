import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import maleItemTmpl from './maleItemTmpl.html';
import { GenesView } from "@view/panel/base/genes";

class MaleItemView extends BaseHTMLView {

    constructor(male) {
        let el = document.createElement('li');
        super(el);
        this._male = male;

        this._render();

        this._el.addEventListener('click', this._onClick.bind(this));

    }

    toggleSelect(isSelected) {
        this._maleItemEl.classList.toggle('queen-manager__male_item--selected', isSelected);
    }

    _render() {
        this._el.innerHTML = maleItemTmpl;
        this._el.querySelector('[data-name]').innerHTML = this._male.id;
        this._maleItemEl = this._el.querySelector('[data-male-item]');
        this._genesView = new GenesView(this._el.querySelector('[data-genes]'));
        this._genesView.showGenes(this._male.genes);
    }

    _onClick() {
        this.events.emit('click');
    }

}

export {
    MaleItemView
}