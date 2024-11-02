import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import coloniesTabTmpl from "./coloniesTab.html";
import { ColoniesListView } from './coloniesList';
import { ColonyManager } from './colonyManager';

class ColoniesTabView extends BaseHTMLView {

    constructor(el) {
        super(el);
        
        this._render();

        this._stopListenSelectedColonyChanged = this._coloniesList.events.on('selectedColonyChanged', this._manageSelectedColony.bind(this));
        this._stopListenColonyBorn = this.$domainFacade.events.on('colonyBorn', this._renderMode.bind(this));
        this._stopListenColonyDied = this.$domainFacade.events.on('colonyDied', this._renderMode.bind(this));
        this._prepareStarterPackBtn.addEventListener('click', this._onPrepareStarterPackBtnClick.bind(this));
        this._stopListenEntityDied = this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this._stopListenEntityBorn = this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));

    }

    showNestManagerFor(nest){
        this._coloniesList.selectColony(nest.fromColony);
        this._colonyManager.manageColony(this._coloniesList.selectedColony, nest);
    }

    _render() {
        this._el.innerHTML = coloniesTabTmpl;

        this._noColoniesPlaceholderEl = this._el.querySelector('[data-no-colonies-space-holder]');
        this._prepareStarterPackBtn = this._el.querySelector('[data-prepare-starter-pack]');

        this._coloniesList = new ColoniesListView(this._el.querySelector('[data-colonies-list]'));
        this._colonyManager = new ColonyManager(this._el.querySelector('[data-colony-manager]'));

        this._manageSelectedColony();
        this._renderMode();
        this._renderPrepareStarterPackBtnState();
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

    _renderPrepareStarterPackBtnState() {
        this._prepareStarterPackBtn.classList.toggle('hidden', this.$domainFacade.isAnyMyAnt());
    }

    remove() {
        super.remove();
        this._coloniesList.remove();
        this._colonyManager.remove();
        this._stopListenColonyBorn();
        this._stopListenColonyDied();
        this._stopListenSelectedColonyChanged();
        this._stopListenEntityDied();
        this._stopListenEntityBorn();
    }

    _onPrepareStarterPackBtnClick() {
        this.$domainFacade.prepareStarterPack();
        this.$eventBus.emit('prepareStarterPackBtnClick');
    }

    _onSomeoneDied(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderPrepareStarterPackBtnState();
        }
    }

    _onSomeoneBorn(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderPrepareStarterPackBtnState();
        }
    }

}

export {
    ColoniesTabView
}