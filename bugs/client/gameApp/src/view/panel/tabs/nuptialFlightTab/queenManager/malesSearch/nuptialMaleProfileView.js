import { BaseHTMLView } from "@view/base/baseHTMLView";
import nuptialMaleProfileTmpl from './nuptialMaleProfileTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";

class NuptialMaleProfileView extends BaseHTMLView {

    constructor(el) {
        super(el);
    }

    _render() {
        this._el.innerHTML = nuptialMaleProfileTmpl;

        this._el.querySelector('[data-attack]').innerHTML = this._male.stats.attack;
        this._el.querySelector('[data-defense]').innerHTML = this._male.stats.defence;
        this._el.querySelector('[data-speed]').innerHTML = this._male.stats.distancePerStep;
        this._el.querySelector('[data-hp-regen-rate]').innerHTML = this._male.stats.hpRegenRate;
        this._el.querySelector('[data-max-hp]').innerHTML = this._male.stats.maxHp;
        this._el.querySelector('[data-sight-distance]').innerHTML = this._male.stats.sightDistance;
        this._el.querySelector('[data-appetite]').innerHTML = this._male.stats.appetite;
        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome]'), this._male.genome);
    }

    showMale(male) {
        this._reset();
        this._male = male;

        this._render();
    }

    _reset() {
        if (this._male) {
            this._genomeView.remove();
        }
    }

}

export {
    NuptialMaleProfileView
}