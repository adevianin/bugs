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

    }

    showNestManagerFor(nest){
        this._coloniesList.selectColony(nest.fromColony);
        this._colonyManager.manageColony(this._coloniesList.selectedColony, nest);
    }

    _render() {
        this._el.innerHTML = coloniesTabTmpl;

        this._noColoniesPlaceholderEl = this._el.querySelector('[data-no-colonies-space-holder]');

        this._coloniesList = new ColoniesListView(this._el.querySelector('[data-colonies-list]'));
        this._colonyManager = new ColonyManager(this._el.querySelector('[data-colony-manager]'));

        this._manageSelectedColony();
        this._renderMode();
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

    remove() {
        super.remove();
        this._coloniesList.remove();
        this._colonyManager.remove();
        this._stopListenColonyBorn();
        this._stopListenColonyDied();
        this._stopListenSelectedColonyChanged();
    }

}

export {
    ColoniesTabView
}