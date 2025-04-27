import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import antTmpl from './antTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { antTypesLabels } from "@view/labels/antTypesLabels";
import { convertStepsToYear } from "@utils/convertStepsToYear";
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { doubleClickProtection } from '@common/utils/doubleClickProtection';

class AntView extends BaseGameHTMLView {

    constructor(ant) {
        let el = document.createElement('tbody');
        super(el);
        this._ant = ant;
        this._profileState = false;

        this._render();

        this._nuptialFlightActionBtn.addEventListener('click', doubleClickProtection(this._onNuptialFlightBtnClick.bind(this)));
        this._guardianTypeSelector.addEventListener('change', this._onGuardianBehaviorSelectorChange.bind(this));
        this._cooperativeBehaviorTogglerEl.addEventListener('change', this._onCooperativeBehaviorTogglerChange.bind(this));
        this._nestSelector.events.on('changed', this._onNestChanged.bind(this));
        this._profileBtn.addEventListener('click', this._onProfileBtnClick.bind(this));
        this._showAntBtn.addEventListener('click', this._onShowAntBtnClick.bind(this));

        this._stopListenCurrentActivityChanged = this._ant.on('currentActivityChanged', this._renderCurrentActivity.bind(this));
        this._stopListenHomeNestChanged = this._ant.on('homeNestIdChanged', this._onHomeNestChanged.bind(this));
        this._stopListenIsHungryChanged = this._ant.on('isHungryChanged', this._renderIsHungry.bind(this));

        this._stopListenCurrentStepChanged = this.$domain.events.on('currentStepChanged', this._renderAge.bind(this));
    }

    remove() {
        this._stopListenCurrentStepChanged();
        this._stopListenCurrentActivityChanged();
        this._stopListenHomeNestChanged();
        this._stopListenIsHungryChanged();
        this._nestSelector.remove();
        this._genomeView.remove();
        if (this._breedingMaleGenomeView) {
            this._breedingMaleGenomeView.remove();
        }
        super.remove();
    }

    _onGuardianBehaviorSelectorChange () {
        this.$domain.antChangeGuardianBehavior(this._ant.id, this._guardianTypeSelector.value);
    }

    _onCooperativeBehaviorTogglerChange () {
        this.$domain.antToggleCooperativeBehavior(this._ant.id, this._cooperativeBehaviorTogglerEl.checked);
    }

    _render() {
        this._el.innerHTML = antTmpl;

        this._el.querySelector('[data-name]').innerHTML = this._ant.name;
        this._el.querySelector('[data-type]').innerHTML = this._ant.isQueenOfColony ? 'Королева' : antTypesLabels[this._ant.antType];

        this._nestSelector = new NestSelectorView(this._el.querySelector('[data-nest]'), this._ant.fromColony, false);
        this._nestSelector.nestId = this._ant.homeNestId;
        this._nestSelector.disabled = this._ant.isQueenOfColony;

        this._guardianTypeSelector = this._el.querySelector('[data-guardian-type]');
        this._guardianTypeSelector.value = this._ant.guardianBehavior;
        this._guardianTypeSelector.disabled = !this._ant.canBeGuardian;

        this._cooperativeBehaviorTogglerEl = this._el.querySelector('[data-is-cooperactive]');
        this._cooperativeBehaviorTogglerEl.checked = this._ant.isCooperativeBehavior;
        this._cooperativeBehaviorTogglerEl.disabled = !this._ant.canBeCooperative;

        this._el.querySelector('[data-id]').innerHTML = this._ant.id;

        this._profileContainerEl = this._el.querySelector('[data-ant-profile]');
        this._profileBtn = this._el.querySelector('[data-profile-btn]');
        this._renderProfileState();
        
        this._currentActivityEl = this._el.querySelector('[data-current-activity]');
        this._renderCurrentActivity();

        this._ageEl = this._el.querySelector('[data-age]');
        this._renderAge();

        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome]'), this._ant.genome);

        this._renderStats();

        this._renderBreedingMaleGenome();
        
        this._nuptialFlightActionBtn = this._el.querySelector('[data-nuptial-flight]');
        this._renderActionBtns();

        this._showAntBtn = this._el.querySelector('[data-show-ant]');

        this._isHungryEl = this._el.querySelector('[data-is-hungry]');
        this._renderIsHungry();
    }

    _onNuptialFlightBtnClick() {
        this.$domain.antFlyNuptialFlight(this._ant.id);
    }

    _renderActionBtns() {
        this._nuptialFlightActionBtn.classList.toggle('g-hidden', !this._ant.canFlyNuptialFlight);
    }

    _renderAge() {
        let livedSteps = this.$domain.currentStep - this._ant.birthStep;
        this._ageEl.innerHTML = convertStepsToYear(livedSteps, true);
    }

    _renderProfileState() {
        this._profileContainerEl.classList.toggle('g-hidden', !this._profileState);
        this._profileBtn.innerHTML = this._profileState ? '-' : '+';
    }

    _renderCurrentActivity() {
        let messageId = `${this._ant.currentActivity}_activity`;
        this._currentActivityEl.innerHTML = this._ant.currentActivity ? this.$messages[messageId] : this.$messages.nothing_activity;
    }

    _renderStats() {
        let statsEl = this._el.querySelector('[data-stats]');
        statsEl.querySelector('[data-max-hp]').innerHTML = this._ant.stats.maxHp;
        statsEl.querySelector('[data-hp-regen-rate]').innerHTML = this._ant.stats.hpRegenRate;
        statsEl.querySelector('[data-speed]').innerHTML = this._ant.stats.distancePerStep;
        statsEl.querySelector('[data-sight-distance]').innerHTML = this._ant.stats.sightDistance;
        statsEl.querySelector('[data-strength]').innerHTML = this._ant.stats.strength;
        statsEl.querySelector('[data-defense]').innerHTML = this._ant.stats.defence;
        statsEl.querySelector('[data-appetite]').innerHTML = this._ant.stats.appetite;
        statsEl.querySelector('[data-min-temperature]').innerHTML = this._ant.stats.minTemperature;
        statsEl.querySelector('[data-life-span]').innerHTML = convertStepsToYear(this._ant.stats.lifeSpan, true);
    }

    _renderBreedingMaleGenome() {
        if (this._ant.isQueenOfColony) {
            this._breedingMaleGenomeView = new GenomeInlineView(this._el.querySelector('[data-breeding-male-genome]'), this._ant.breedingMaleGenome);
        } else {
            this._el.querySelector('[data-breeding-male-genome-container]').remove();
        }
    }

    _renderIsHungry() {
        this._isHungryEl.innerHTML = this._ant.isHungry ? 'голодний' : 'ситий';
    }

    _onNestChanged() {
        this.$domain.antRelocate(this._ant.id, this._nestSelector.nestId);
    }

    _onProfileBtnClick() {
        this._profileState = !this._profileState;
        this._renderProfileState();
    }

    _onShowAntBtnClick() {
        this.$eventBus.emit('showPointRequest', this._ant.position);
        this.$eventBus.emit('highlightEntity', {
            entityId: this._ant.id,
            type: 'pointer'
        });
    }

    _onHomeNestChanged() {
        this._nestSelector.nestId = this._ant.homeNestId;
    }

}

export {
    AntView
}