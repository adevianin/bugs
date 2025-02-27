import './style.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import nuptialFlightTabTmpl from './nuptialFlightTab.html';
import { BreedingManagerView } from './breedingManager/breedinManagerView';

class NuptialFlightTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this.$domainFacade.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));
        this._bornNewAntaraBtn.addEventListener('click', this._onBornNewAntaraBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = nuptialFlightTabTmpl;

        this._nuptialFlightModeEl = this._el.querySelector('[data-nuptial-flight-mode]');
        this._bornNewAntaraModeEl = this._el.querySelector('[data-born-new-antara-mode]');
        this._waitingNuptialFlightModeEl = this._el.querySelector('[data-waiting-nuptial-flight-mode]');
        this._bornNewAntaraBtn = this._el.querySelector('[data-born-new-antara-btn]');

        this._breedingManagerView = new BreedingManagerView(this._el.querySelector('[data-breeding-manager]'));

        this._renderTabMode();
    }

    _renderTabMode() {
        let isNuptialSeason = this.$domainFacade.world.isNuptialSeasonNow;
        let isAnyAnt = this.$domainFacade.isAnyMyAnt();

        this._nuptialFlightModeEl.classList.toggle('g-hidden', !isNuptialSeason || !isAnyAnt);
        this._bornNewAntaraModeEl.classList.toggle('g-hidden', !isNuptialSeason || isAnyAnt);
        this._waitingNuptialFlightModeEl.classList.toggle('g-hidden', isNuptialSeason);
    }

    _onSeasonChanged() {
        this._renderTabMode();
    }

    _onSomeoneDied(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderTabMode();
        }
    }

    _onSomeoneBorn(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderTabMode();
        }
    }

    _onBornNewAntaraBtnClick() {
        this.$domainFacade.bornNewAntara();
    }
}

export {
    NuptialFlightTabView
}