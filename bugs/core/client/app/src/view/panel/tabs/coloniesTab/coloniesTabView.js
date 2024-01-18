import './styles.css';
import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import coloniesTabTmpl from "./coloniesTab.html";
import { ColoniesListView } from './coloniesList';
import { ColonyManager } from './colonyManager';

class ColoniesTabView extends BaseHTMLView {

    constructor(el) {
        super(el);
        
        this._render();

        this._coloniesList.events.addListener('selectedColonyChanged', this._manageSelectedColony.bind(this));
    }

    showNestManagerFor(nest){
        this._coloniesList.selectColony(nest.fromColony);
        this._colonyManager.showNestManagerFor(nest);
    }

    _render() {
        this._el.innerHTML = coloniesTabTmpl;

        this._coloniesList = new ColoniesListView(this._el.querySelector('[data-colonies-list]'));
        this._colonyManager = new ColonyManager(this._el.querySelector('[data-colony-manager]'));
        this._manageSelectedColony();
    }

    _manageSelectedColony() {
        this._colonyManager.manageColony(this._coloniesList.selectedColony);
    }

}

export {
    ColoniesTabView
}