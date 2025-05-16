import './style.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nuptialFlightTabTmpl from './nuptialFlightTab.html';
import { BreedingManagerView } from './breedingManager/breedinManagerView';
import { HelpCallerView } from '@view/panel/helpCaller/helpCallerView';
import { CONSTS } from '@domain/consts';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class NuptialFlightTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this.$domain.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
        this.$domain.events.on('currentStepChanged', this._onStepChanged.bind(this));
    }

    _render() {
        this._el.innerHTML = nuptialFlightTabTmpl;

        this._el.querySelector('[data-nuptial-flight-tab-label-name]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NAME);
        this._el.querySelector('[data-nuptial-flight-tab-label-season-start-after]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NUPT_SEASON_START_AFTER);

        this._timeToNuptialSeasonEl = this._el.querySelector('[data-time-to-nuptial-season]');
        this._nuptialFlightModeEl = this._el.querySelector('[data-nuptial-flight-mode]');
        this._waitingNuptialFlightModeEl = this._el.querySelector('[data-waiting-nuptial-flight-mode]');
        this._breedingManagerView = new BreedingManagerView(this._el.querySelector('[data-breeding-manager]'));
        this._helpCallerBreeding = new HelpCallerView(this._el.querySelector('[data-help-sign]'), 'breeding');
        this._renderIsNuptialSeasonState();
        this._renderTimeToNuptialSeason();
    }

    _renderIsNuptialSeasonState() {
        let isNuptialSeason = this._checkIsNuptialSeasonNow();
        this._nuptialFlightModeEl.classList.toggle('g-hidden', !isNuptialSeason);
        this._waitingNuptialFlightModeEl.classList.toggle('g-hidden', isNuptialSeason);
    }

    _onSeasonChanged() {
        this._renderIsNuptialSeasonState();
        this._renderTimeToNuptialSeason();
    }

    _onStepChanged() {
        if (!this._checkIsNuptialSeasonNow()) {
            this._renderTimeToNuptialSeason();
        }
    }

    _checkIsNuptialSeasonNow() {
        return CONSTS.NUPTIAL_FLIGHT_SEASONS.indexOf(this.$domain.currentSeason) != -1;
    }

    _renderTimeToNuptialSeason() {
        let stepsCount = this._getStepsCountToNuptialSeasonStart();
        let secondsCount = stepsCount * CONSTS.STEP_TIME;
        let hours = Math.floor(secondsCount / 3600);
        let minutes = Math.floor((secondsCount % 3600) / 60);
        let seconds = secondsCount % 60;
        if (hours) {
            this._timeToNuptialSeasonEl.innerHTML = this.$mm.format(GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_FULL, hours, minutes, seconds);
        } else {
            this._timeToNuptialSeasonEl.innerHTML = this.$mm.format(GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_SHORT, minutes, seconds);
        }
        
    }

    _getStepsCountToNuptialSeasonStart() {
        let nuptSeasonStartYearStep = CONSTS.SUMMER_START_YEAR_STEP;
        let currentStep = this.$domain.currentStep;
        let currentYearStep = currentStep % CONSTS.STEPS_IN_YEAR;
        if (currentYearStep <= nuptSeasonStartYearStep) {
            return nuptSeasonStartYearStep - currentYearStep;
        } else {
            return CONSTS.STEPS_IN_YEAR - currentYearStep + nuptSeasonStartYearStep;
        }
    }

}

export {
    NuptialFlightTabView
}