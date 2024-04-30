import { BaseHTMLView } from "@view/base/baseHTMLView";
import climateTabTmpl from './climateTabTmpl.html';

class ClimateTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._climate = this.$domainFacade.getClimate();

        this._climate.on('change', this._renderTemperatureChange.bind(this));

        this._render();
    }

    _render() {
        this._el.innerHTML = climateTabTmpl;

        this._temperatureEl = this._el.querySelector('[data-temperature]');
        this._changeDirectionEl = this._el.querySelector('[data-change-direction]');

        this._renderTemperatureChange();
    }

    _renderTemperatureChange() {
        this._temperatureEl.innerHTML = this._climate.dailyTemperature;
        this._changeDirectionEl.innerHTML = this._climate.changeDirection > 0 ? 'потепління' : 'похолодання';
    }

}

export {
    ClimateTabView
}