import { BaseHTMLView } from "@view/base/baseHTMLView";
import antTmpl from './antTmpl.html';
import { NestSelectorView } from "@view/base/nestSelector";
import { AntTypes } from "@domain/enum/antTypes";

class AntView extends BaseHTMLView {

    constructor(ant) {
        let el = document.createElement('tr');
        super(el);
        this._ant = ant;

        this._ant.on('died', this.remove.bind(this));

        this._render();

        this._nuptialFlightActionBtn.addEventListener('click', this._onNuptialFlightBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = antTmpl;
        this._el.querySelector('[data-type]').innerHTML = this._ant.antType;
        this._el.querySelector('[data-attack]').innerHTML = this._ant.stats.attack;
        this._el.querySelector('[data-defence]').innerHTML = this._ant.stats.defence;
        this._el.querySelector('[data-max-hp]').innerHTML = this._ant.maxHp;

        this._nestSelector = new NestSelectorView(this._ant.fromColony);
        this._nestSelector.nestId = this._ant.homeNestId;
        this._el.querySelector('[data-nest]').append(this._nestSelector.el);

        this._renderActionBtns();
    }

    remove() {
        this._nestSelector.remove();
        super.remove();
    }

    _onNuptialFlightBtnClick() {
        this._ant.flyNuptialFlight();
    }

    _renderActionBtns() {
        this._nuptialFlightActionBtn = this._el.querySelector('[data-nuptial-flight]');
        this._flyAwayActionBtn = this._el.querySelector('[data-fly-away]');
        
        let canFlyNuptialFlight = this._ant.antType == AntTypes.QUEEN && this._ant.canFlyNuptialFlight;
        this._nuptialFlightActionBtn.classList.toggle('hidden', !canFlyNuptialFlight);
    }

}

export {
    AntView
}