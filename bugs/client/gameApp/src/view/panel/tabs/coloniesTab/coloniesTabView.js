import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import coloniesTabTmpl from "./coloniesTab.html";
import { ColoniesListView } from './coloniesList';
import { ColonyManager } from './colonyManager';

class ColoniesTabView extends BaseHTMLView {

    constructor(el) {
        super(el);
        
        this._render();

        this._coloniesList.events.on('selectedColonyChanged', this._manageSelectedColony.bind(this));
        this.$domainFacade.events.on('colonyBorn', this._renderMode.bind(this));
        this.$domainFacade.events.on('colonyDied', this._renderMode.bind(this));
        this._bornNewAntaraBtn.addEventListener('click', this._onBornNewAntaraBtnClick.bind(this));
        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));

    }

    showNestManagerFor(nest){
        this._coloniesList.selectColony(nest.fromColony);
        this._colonyManager.manageColony(this._coloniesList.selectedColony, nest);
    }

    _render() {
        this._el.innerHTML = coloniesTabTmpl;

        this._noColoniesPlaceholderEl = this._el.querySelector('[data-no-colonies-space-holder]');
        this._bornNewAntaraBtn = this._el.querySelector('[data-born-new-antara]');

        this._coloniesList = new ColoniesListView(this._el.querySelector('[data-colonies-list]'));
        this._colonyManager = new ColonyManager(this._el.querySelector('[data-colony-manager]'));

        this._manageSelectedColony();
        this._renderMode();
        this._renderBornNewAntaraBtnState();
    }

    _manageSelectedColony() {
        this._colonyManager.manageColony(this._coloniesList.selectedColony);
    }

    _renderMode() {
        let isEmpty = !this.$domainFacade.isAnyMyColony();
        if (isEmpty) {
            this._coloniesList.toggle(false);
            this._colonyManager.toggle(false);
            this._noColoniesPlaceholderEl.classList.remove('hidden');
        } else {
            this._coloniesList.toggle(true);
            this._colonyManager.toggle(true);
            this._noColoniesPlaceholderEl.classList.add('hidden');
        }
    }

    _renderBornNewAntaraBtnState() {
        this._bornNewAntaraBtn.classList.toggle('hidden', this.$domainFacade.isAnyMyAnt());
    }

    _onBornNewAntaraBtnClick() {
        this.$domainFacade.bornNewAntara();
        this.$eventBus.emit('bornNewAntaraBtnClick');
    }

    _onSomeoneDied(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderBornNewAntaraBtnState();
        }
    }

    _onSomeoneBorn(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderBornNewAntaraBtnState();
        }
    }

}

export {
    ColoniesTabView
}