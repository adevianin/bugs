import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import climateTmpl from './climateTmpl.html';
import { SeasonBarView } from "./seasonBarView";

class ClimateView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._climate = this.$domainFacade.getClimate();

        this._render();

        this._climate.on('change', this._renderTemperatureChange.bind(this));
    }

    _render() {
        this._el.innerHTML = climateTmpl;
        this._el.classList.add('climate__container');

        this._temperatureEl = this._el.querySelector('[data-temperature]');
        this._el.querySelector('[data-temperature-container]').setAttribute('title', this.$messages.temperature);
        this._seasonBarView = new SeasonBarView(this._el.querySelector('[data-season-bar]'));

        this._renderTemperatureChange();
    }

    _renderTemperatureChange() {
        this._temperatureEl.innerHTML = this._climate.dailyTemperature;
    }

}

export {
    ClimateView
}