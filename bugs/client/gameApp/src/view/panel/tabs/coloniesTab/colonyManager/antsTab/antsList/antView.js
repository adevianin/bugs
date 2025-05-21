import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import antTmpl from './antTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { convertStepsToYear } from "@utils/convertStepsToYear";
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import { AntStatsView } from '@view/panel/base/antStats/antStatsView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { AntTypes } from "@domain/enum/antTypes";
import { VIEW_SETTINGS } from '@view/viewSettings';

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
        this._antStatsView.remove();
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
        this._antTypeEl = this._el.querySelector('[data-type]');
        this._renderAntType();

        this._nestSelector = new NestSelectorView(this._el.querySelector('[data-nest]'), this._ant.fromColony, false);
        this._nestSelector.nestId = this._ant.homeNestId;
        this._nestSelector.disabled = this._ant.isQueenOfColony;

        this._guardianTypeSelector = this._el.querySelector('[data-guardian-type]');
        this._guardianTypeSelector.value = this._ant.guardianBehavior;
        this._guardianTypeSelector.disabled = !this._ant.canBeGuardian;
        this._el.querySelector('[data-guardian-behavior-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_LABEL);
        this._el.querySelector('[data-guardian-behavior-option-none]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_NONE);
        this._el.querySelector('[data-guardian-behavior-option-nest]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_NEST);
        this._el.querySelector('[data-guardian-behavior-option-colony]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_COLONY);

        this._cooperativeBehaviorTogglerEl = this._el.querySelector('[data-is-cooperactive]');
        this._cooperativeBehaviorTogglerEl.checked = this._ant.isCooperativeBehavior;
        this._cooperativeBehaviorTogglerEl.disabled = !this._ant.canBeCooperative;
        this._el.querySelector('[data-cooperative-behavior-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_COOPERATIVE_BEHAVIOR_LABEL);

        if (VIEW_SETTINGS.renderAntId) {
            this._el.querySelector('[data-id]').innerHTML = this._ant.id;
        } else {
            this._el.querySelector('[data-id]').remove();
        }

        this._profileContainerEl = this._el.querySelector('[data-ant-profile]');
        this._profileBtn = this._el.querySelector('[data-profile-btn]');
        this._renderProfileState();
        
        this._currentActivityEl = this._el.querySelector('[data-current-activity]');
        this._el.querySelector('[data-current-activity-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_CURRENT_ACTIVITY_LABEL);
        this._renderCurrentActivity();

        this._ageEl = this._el.querySelector('[data-age]');
        this._el.querySelector('[data-age-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_AGE_LABEL);
        this._renderAge();

        this._el.querySelector('[data-ant-genom-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_GENOME_LABEL);
        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome]'), this._ant.genome);

        this._antStatsView = new AntStatsView(this._ant.stats);
        this._el.querySelector('[data-ant-stats]').append(this._antStatsView.el);

        this._renderBreedingMaleGenome();
        
        this._nuptialFlightActionBtn = this._el.querySelector('[data-nuptial-flight]');
        this._nuptialFlightActionBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_NUPTIAL_FLIGHT_BTN_LABEL);
        this._renderActionBtns();

        this._showAntBtn = this._el.querySelector('[data-show-ant]');
        this._showAntBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_SHOW_BTN_LABEL);

        this._el.querySelector('[data-is-hungry-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_IS_HUNGRY_LABEL);
        this._isHungryEl = this._el.querySelector('[data-is-hungry]');
        this._renderIsHungry();
    }

    _renderAntType() {
        let typeText = null;
        if (this._ant.isQueenOfColony) {
            typeText = this.$mm.get(GAME_MESSAGE_IDS.ANT_TYPE_QUEEN);
        } else {
            switch (this._ant.antType) {
                case AntTypes.QUEEN:
                    typeText = this.$mm.get(GAME_MESSAGE_IDS.ANT_TYPE_FEMALE);
                    break;
                case AntTypes.MALE:
                    typeText = this.$mm.get(GAME_MESSAGE_IDS.ANT_TYPE_MALE);
                    break;
                case AntTypes.WARRIOR:
                    typeText = this.$mm.get(GAME_MESSAGE_IDS.ANT_TYPE_WARRIOR);
                    break;
                case AntTypes.WORKER:
                    typeText = this.$mm.get(GAME_MESSAGE_IDS.ANT_TYPE_WORKER);
                    break;
                default:
                    typeText = this._ant.antType;
            }
        }
        this._antTypeEl.innerHTML = typeText;
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
        let hideProfileBtnText = this.$mm.get(GAME_MESSAGE_IDS.ANT_VIEW_HIDE_PROFILE_BTN);
        let showProfileBtnText = this.$mm.get(GAME_MESSAGE_IDS.ANT_VIEW_SHOW_PROFILE_BTN);
        this._profileBtn.innerHTML = this._profileState ? hideProfileBtnText : showProfileBtnText;
    }

    _renderCurrentActivity() {
        let activityText = null;

        switch (this._ant.currentActivity) {
            case 'preparing_for_hibernation':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_PREPARING_FOR_HIBERNATION);
                break;
            case 'hibernation':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_HIBERNATION);
                break;
            case 'patroling_nest_territory':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_PATROLING_NEST_TERRITORY);
                break;
            case 'collecting_food':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_COLLECTING_FOOD);
                break;
            case 'feeding_myself':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_FEEDING_MYSELF);
                break;
            case 'defending_home_nest':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_HOME_NEST);
                break;
            case 'defending_myself':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_MYSELF);
                break;
            case 'defending_colony':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_COLONY);
                break;
            case 'sheltering_in_nest':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_SHELTERING_IN_NEST);
                break;
            case 'in_operation':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_IN_OPERATION);
                break;
            case 'go_home':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_GOING_HOME);
                break;
            case 'watching_nest':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_WATCHING_NEST);
                break;
            case 'founding_main_nest':
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_BUILDING_MAIN_NEST);
                break;
            default:
                activityText = this.$mm.get(GAME_MESSAGE_IDS.ANT_ACTIVITY_NOTHING);
        }

        this._currentActivityEl.innerHTML = activityText;
    }

    _renderBreedingMaleGenome() {
        if (this._ant.isQueenOfColony) {
            this._el.querySelector('[data-breeding-male-genome-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_NUPTIAL_MALE_GENOME_LABEL);
            this._breedingMaleGenomeView = new GenomeInlineView(this._el.querySelector('[data-breeding-male-genome]'), this._ant.breedingMaleGenome);
        } else {
            this._el.querySelector('[data-breeding-male-genome-container]').remove();
        }
    }

    _renderIsHungry() {
        if (this._ant.isHungry) {
            this._isHungryEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_IS_HUNGRY_STATE_HUNGRY);
        } else {
            this._isHungryEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.ANT_IS_HUNGRY_STATE_NOT_HUNGRY);
        }
    }

    _onNestChanged() {
        this.$domain.antRelocate(this._ant.id, this._nestSelector.nestId);
    }

    _onProfileBtnClick() {
        this._profileState = !this._profileState;
        this._renderProfileState();
    }

    async _onShowAntBtnClick() {
        let antData = await this.$domain.getEntityDataById(this._ant.id);
        this.$eventBus.emit('showPointRequest', antData.position);
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