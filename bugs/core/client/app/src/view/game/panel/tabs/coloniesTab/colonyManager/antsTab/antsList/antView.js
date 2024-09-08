import { BaseHTMLView } from "@view/base/baseHTMLView";
import antTmpl from './antTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";
import { AntTypes } from "@domain/enum/antTypes";

class AntView extends BaseHTMLView {

    constructor(ant) {
        let el = document.createElement('tr');
        super(el);
        this._ant = ant;

        this._ant.on('died', this.remove.bind(this));

        this._render();

        this._nuptialFlightActionBtn.addEventListener('click', this._onNuptialFlightBtnClick.bind(this));
        this._guardianBehaviorToggleEl.addEventListener('change', this._onGuardianBehaviorTogglerChange.bind(this));
        this._cooperativeBehaviorTogglerEl.addEventListener('change', this._onCooperativeBehaviorTogglerChange.bind(this));
        this._nestSelector.events.addListener('changed', this._onNestChanged.bind(this));
    }

    _onGuardianBehaviorTogglerChange () {
        this._ant.toggleGuardianBehavior(this._guardianBehaviorToggleEl.checked);
    }

    _onCooperativeBehaviorTogglerChange () {
        this._ant.toggleCooperativeBehavior(this._cooperativeBehaviorTogglerEl.checked);
    }

    _render() {
        this._el.innerHTML = antTmpl;
        this._el.querySelector('[data-id]').innerHTML = this._ant.id;
        this._el.querySelector('[data-type]').innerHTML = this._ant.antType;
        this._el.querySelector('[data-attack]').innerHTML = this._ant.stats.attack;
        this._el.querySelector('[data-defence]').innerHTML = this._ant.stats.defence;
        this._el.querySelector('[data-max-hp]').innerHTML = this._ant.maxHp;

        this._nestSelector = new NestSelectorView(this._ant.fromColony);
        this._nestSelector.nestId = this._ant.homeNestId;
        this._el.querySelector('[data-nest]').append(this._nestSelector.el);

        this._renderActionBtns();

        this._guardianBehaviorToggleEl = this._el.querySelector('[data-is-guardian]');
        this._guardianBehaviorToggleEl.checked = this._ant.isGuardianBehavior;

        this._cooperativeBehaviorTogglerEl = this._el.querySelector('[data-is-cooperactive]');
        this._cooperativeBehaviorTogglerEl.checked = this._ant.isCooperativeBehavior;

        this._el.querySelector('[data-genome-debug]').addEventListener('click', () => {
            console.log(this._ant.genome);
        })
        
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
        
        let canFlyNuptialFlight = this._checkCanFlyNuptialFlight(this._ant);
        this._nuptialFlightActionBtn.classList.toggle('hidden', !canFlyNuptialFlight);
    }

    _checkCanFlyNuptialFlight(ant) {
        if (ant.antType == AntTypes.QUEEN) {
            return ant.canFlyNuptialFlight;
        } else if (ant.antType == AntTypes.MALE) {
            return true;
        }
    }

    _onNestChanged() {
        this._ant.relocateToNest(this._nestSelector.nestId);
    }

}

export {
    AntView
}