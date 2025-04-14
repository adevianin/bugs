import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import climateTmpl from './climateTmpl.html';
import { SeasonBarView } from "./seasonBarView";
import { convertStepsToYear } from '@utils/convertStepsToYear';

class ClimateView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._climate = this.$domain.getClimate();

        this._render();

        this._climate.on('change', this._renderTemperatureChange.bind(this));
        this.$domain.events.on('currentStepChanged', this._renderYear.bind(this));
    }

    _render() {
        this._el.innerHTML = climateTmpl;
        this._el.classList.add('climate__container');

        this._temperatureEl = this._el.querySelector('[data-temperature]');
        this._el.querySelector('[data-temperature-container]').setAttribute('title', this.$messages.temperature);
        this._seasonBarView = new SeasonBarView(this._el.querySelector('[data-season-bar]'));

        this._yearEl = this._el.querySelector('[data-year]');

        this._renderTemperatureChange();
        this._renderYear();
    }

    _renderTemperatureChange() {
        this._temperatureEl.innerHTML = this._climate.dailyTemperature;
    }

    _renderYear() {
        this._yearEl.innerHTML = convertStepsToYear(this.$domain.currentStep);
    }

}

export {
    ClimateView
}