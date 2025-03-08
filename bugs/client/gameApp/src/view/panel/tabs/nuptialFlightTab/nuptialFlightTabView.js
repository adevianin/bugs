import './style.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nuptialFlightTabTmpl from './nuptialFlightTab.html';
import { BreedingManagerView } from './breedingManager/breedinManagerView';

class NuptialFlightTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this.$domainFacade.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
    }

    _render() {
        this._el.innerHTML = nuptialFlightTabTmpl;

        this._nuptialFlightModeEl = this._el.querySelector('[data-nuptial-flight-mode]');
        this._waitingNuptialFlightModeEl = this._el.querySelector('[data-waiting-nuptial-flight-mode]');
        this._bornNewAntaraBtn = this._el.querySelector('[data-born-new-antara-btn]');

        this._breedingManagerView = new BreedingManagerView(this._el.querySelector('[data-breeding-manager]'));

        this._renderIsNuptialSeasonState();
    }

    _renderIsNuptialSeasonState() {
        let isNuptialSeason = this.$domainFacade.world.isNuptialSeasonNow;
        this._nuptialFlightModeEl.classList.toggle('g-hidden', !isNuptialSeason);
        this._waitingNuptialFlightModeEl.classList.toggle('g-hidden', isNuptialSeason);
    }

    _onSeasonChanged() {
        this._renderIsNuptialSeasonState();
    }

}

export {
    NuptialFlightTabView
}