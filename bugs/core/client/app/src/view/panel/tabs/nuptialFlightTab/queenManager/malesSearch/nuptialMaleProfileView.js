import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import nuptialMaleProfileTmpl from './nuptialMaleProfileTmpl.html';
import { ClosableGenomeView } from "@view/panel/base/genome/closableGenomeView";

class NuptialMaleProfileView extends BaseHTMLView {

    constructor(el) {
        super(el);
    }

    _render() {
        this._el.innerHTML = nuptialMaleProfileTmpl;

        this._el.querySelector('[data-attack]').innerHTML = Math.round(this._male.stats.attack);
        this._el.querySelector('[data-defense]').innerHTML = Math.round(this._male.stats.defence);
        this._el.querySelector('[data-speed]').innerHTML = Math.round(this._male.stats.distancePerStep);
        this._el.querySelector('[data-hp-regen-rate]').innerHTML = Math.round(this._male.stats.hpRegenRate);
        this._el.querySelector('[data-max-hp]').innerHTML = Math.round(this._male.stats.maxHp);
        this._el.querySelector('[data-sight-distance]').innerHTML = Math.round(this._male.stats.sightDistance);
        this._el.querySelector('[data-is-local]').innerHTML = this._male.isLocal ? 'місцевий' : 'з дальніх країв';
        this._genomeView = new ClosableGenomeView(this._el.querySelector('[data-genome]'), this._male.genome);
    }

    showMale(male) {
        if (this._male) {
            this._reset();
        }
        this._male = male;

        this._render();
    }

    _reset() {
        this._genomeView.remove();
    }

}

export {
    NuptialMaleProfileView
}