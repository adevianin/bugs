import { BaseHTMLView } from "@view/base/baseHTMLView";
import antStatsTmpl from './antStatsTmpl.html'
import { convertStepsToYear } from "@utils/convertStepsToYear";

class AntStatsView extends BaseHTMLView {

    constructor(stats) {
        super(document.createElement('table'));
        this._stats = stats;

        this._render();
    }

    setStats(stats) {
        this._stats = stats;
        this._renderStats();
    }

    _render() {
        this._el.innerHTML = antStatsTmpl;
        this._el.classList.add('g-table');
        
        if (this._stats) {
            this._renderStats();
        }
    }

    _renderStats() {
        this._el.querySelector('[data-max-hp]').innerHTML = this._stats.maxHp;
        this._el.querySelector('[data-hp-regen-rate]').innerHTML =  this._stats.hpRegenRate;
        this._el.querySelector('[data-speed]').innerHTML = this._stats.distancePerStep;
        this._el.querySelector('[data-sight-distance]').innerHTML = this._stats.sightDistance;
        this._el.querySelector('[data-strength]').innerHTML = this._stats.strength;
        this._el.querySelector('[data-defense]').innerHTML = this._stats.defence;
        this._el.querySelector('[data-appetite]').innerHTML = this._stats.appetite;
        this._el.querySelector('[data-min-temperature]').innerHTML = this._stats.minTemperature;
        this._el.querySelector('[data-life-span]').innerHTML = convertStepsToYear(this._stats.lifeSpan);
    }

}

export {
    AntStatsView
}