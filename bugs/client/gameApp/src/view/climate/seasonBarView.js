import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import seasonBarTmpl from './seasonBarTmpl.html';
import { CONSTS } from "@domain/consts";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class SeasonBarView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._percentsPerStep = 100 / CONSTS.STEPS_IN_YEAR;
        this._springStepsLength = CONSTS.SUMMER_START_YEAR_STEP - CONSTS.SPRING_START_YEAR_STEP;
        this._summerStepsLength = CONSTS.AUTUMN_START_YEAR_STEP - CONSTS.SUMMER_START_YEAR_STEP;
        this._autumnStepsLength = CONSTS.WINTER_START_YEAR_STEP - CONSTS.AUTUMN_START_YEAR_STEP;
        this._winterStepsLength = CONSTS.STEPS_IN_YEAR - CONSTS.WINTER_START_YEAR_STEP;

        this._render();

        this.$domain.events.on('currentStepChanged', this._onCurrentStepChanged.bind(this));
    }

    _render() {
        this._el.innerHTML = seasonBarTmpl;

        this._springEl = this._el.querySelector('[data-spring]');
        this._summerEl = this._el.querySelector('[data-summer]');
        this._autumnEl = this._el.querySelector('[data-autumn]');
        this._winterEl = this._el.querySelector('[data-winter]');
        this._markerEl = this._el.querySelector('[data-marker]');

        this._springEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_SPRING);
        this._summerEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_SUMMER);
        this._autumnEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_AUTUMN);
        this._winterEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_WINTER);

        this._springEl.style.width = this._springStepsLength * this._percentsPerStep + '%';
        this._summerEl.style.width = this._summerStepsLength * this._percentsPerStep + '%';
        this._autumnEl.style.width = this._autumnStepsLength * this._percentsPerStep + '%';
        this._winterEl.style.width = this._winterStepsLength * this._percentsPerStep + '%';

        this._renderMarker();
    }

    _renderMarker() {
        let yearStep = this.$domain.currentStep % CONSTS.STEPS_IN_YEAR;
        this._markerEl.style.left = this._percentsPerStep * yearStep + '%';
    }

    _onCurrentStepChanged() {
        this._renderMarker();
    }

}

export {
    SeasonBarView
}