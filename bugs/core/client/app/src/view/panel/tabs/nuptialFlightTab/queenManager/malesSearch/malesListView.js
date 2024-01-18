import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import { MaleItemView } from "./maleItemView";

class MalesListView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._maleViews = {};
    }

    get selectedMale() {
        return this._selectedMale;
    }

    reset() {
        this._clearList();
    }

    setMales(males) {
        this._clearList();
        for (let male of males) {
            let view = new MaleItemView(male);
            view.events.addListener('click', () => this._onMaleViewClick(male))
            this._el.append(view.el);
            this._maleViews[male.id] = view;
        }
    }

    _clearList() {
        for (let maleId in this._maleViews) {
            this._maleViews[maleId].remove();
        }
    }

    _selectMale(male) {
        this._selectedMale = male;
        this.events.emit('selectedMaleChanged');
    }

    _renderSelectedMale() {
        for (let maleId in this._maleViews) {
            let isSelected = this._selectedMale && maleId == this._selectedMale.id;
            this._maleViews[maleId].toggleSelect(isSelected);
        }
    }

    _onMaleViewClick(male) {
        this._selectMale(male);
        this._renderSelectedMale();
    }


}

export {
    MalesListView
}