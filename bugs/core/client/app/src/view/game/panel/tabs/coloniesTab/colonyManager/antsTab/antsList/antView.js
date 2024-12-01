import { BaseHTMLView } from "@view/base/baseHTMLView";
import antTmpl from './antTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";
import { AntTypes } from "@domain/enum/antTypes";
import { CONSTS } from "@domain/consts";
import { antTypesLabels } from "@view/labels/antTypesLabels";

class AntView extends BaseHTMLView {

    constructor(ant) {
        let el = document.createElement('tbody');
        super(el);
        this._ant = ant;
        this._profileState = false;

        this._ant.on('died', this.remove.bind(this));

        this._render();

        this._nuptialFlightActionBtn.addEventListener('click', this._onNuptialFlightBtnClick.bind(this));
        this._guardianTypeSelector.addEventListener('change', this._onGuardianBehaviorSelectorChange.bind(this));
        this._cooperativeBehaviorTogglerEl.addEventListener('change', this._onCooperativeBehaviorTogglerChange.bind(this));
        this._nestSelector.events.addListener('changed', this._onNestChanged.bind(this));
        this._profileBtn.addEventListener('click', this._onProfileBtnClick.bind(this));

        this._stopListenCurrentStepChanged = this.$domainFacade.events.on('currentStepChanged', this._renderAge.bind(this));
    }

    _onGuardianBehaviorSelectorChange () {
        this._ant.changeGuardianBehavior(this._guardianTypeSelector.value);
    }

    _onCooperativeBehaviorTogglerChange () {
        this._ant.toggleCooperativeBehavior(this._cooperativeBehaviorTogglerEl.checked);
    }

    _render() {
        this._el.innerHTML = antTmpl;

        this._nuptialFlightActionBtn = this._el.querySelector('[data-nuptial-flight]');
        this._flyAwayActionBtn = this._el.querySelector('[data-fly-away]');

        this._el.querySelector('[data-id]').innerHTML = this._ant.id;
        this._el.querySelector('[data-name]').innerHTML = this._ant.name;
        this._el.querySelector('[data-type]').innerHTML = this._ant.isQueenOfColony ? 'Королева' : antTypesLabels[this._ant.antType];
        this._el.querySelector('[data-attack]').innerHTML = this._ant.stats.attack;
        this._el.querySelector('[data-defence]').innerHTML = this._ant.stats.defence;
        this._el.querySelector('[data-max-hp]').innerHTML = this._ant.maxHp;

        this._nestSelector = new NestSelectorView(this._ant.fromColony);
        this._nestSelector.nestId = this._ant.homeNestId;
        this._nestSelector.disabled = this._ant.isQueenOfColony;
        this._el.querySelector('[data-nest]').append(this._nestSelector.el);

        this._renderActionBtns();

        this._guardianTypeSelector = this._el.querySelector('[data-guardian-type]');
        this._guardianTypeSelector.value = this._ant.guardianBehavior;
        this._guardianTypeSelector.disabled = this._ant.isQueenOfColony;

        this._cooperativeBehaviorTogglerEl = this._el.querySelector('[data-is-cooperactive]');
        this._cooperativeBehaviorTogglerEl.checked = this._ant.isCooperativeBehavior;
        this._cooperativeBehaviorTogglerEl.disabled = this._ant.isQueenOfColony;

        this._el.querySelector('[data-genome-debug]').addEventListener('click', () => {
            console.log(this._ant.genome);
        });

        this._profileEl = this._el.querySelector('[data-ant-profile]');
        this._profileBtn = this._el.querySelector('[data-profile-btn]');
        this._renderProfileState();

        this._ageEl = this._el.querySelector('[data-age]');
        this._renderAge();
        
    }

    remove() {
        this._stopListenCurrentStepChanged();
        this._nestSelector.remove();
        super.remove();
    }

    _onNuptialFlightBtnClick() {
        this._ant.flyNuptialFlight();
    }

    _renderActionBtns() {
        this._nuptialFlightActionBtn.classList.toggle('hidden', !this._ant.canFlyNuptialFlight);
    }

    _renderAge() {
        let livedSteps = this.$domainFacade.currentStep - this._ant.birthStep;
        let age = Math.floor(livedSteps / CONSTS.STEPS_IN_YEAR);
        this._ageEl.innerHTML = age;
    }

    _renderProfileState() {
        this._profileEl.classList.toggle('hidden', !this._profileState);
        this._profileBtn.innerHTML = this._profileState ? '-' : '+';
    }

    _onNestChanged() {
        this._ant.relocateToNest(this._nestSelector.nestId);
    }

    _onProfileBtnClick() {
        this._profileState = !this._profileState;
        this._renderProfileState();
    }

}

export {
    AntView
}