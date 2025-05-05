import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import coloniesTabTmpl from "./coloniesTab.html";
import { ColonyManager } from './colonyManager';
import { HelpCallerView } from '@view/panel/helpCaller/helpCallerView';
import { ColoniesSelectView } from './coloniesSelect/coloniesSelectView';

class ColoniesTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        
        this._render();

        this._coloniesList.events.on('selectedColonyChanged', this._manageSelectedColony.bind(this));
        this.$domain.myState.on('colonyBorn', this._renderMode.bind(this));
        this.$domain.myState.on('colonyDied', this._renderMode.bind(this));
    }

    showNestManagerFor(nest){
        this._coloniesList.selectColony(nest.fromColony);
        this._colonyManager.manageColony(this._coloniesList.selectedColony, nest);
    }

    _render() {
        this._el.innerHTML = coloniesTabTmpl;

        this._noColoniesPlaceholderEl = this._el.querySelector('[data-no-colonies-space-holder]');

        this._coloniesList = new ColoniesSelectView(this._el.querySelector('[data-colonies-select]'));
        this._colonyManager = new ColonyManager(this._el.querySelector('[data-colony-manager]'));
        this._helpCallerBreeding = new HelpCallerView(this._el.querySelector('[data-help-sign]'), 'colonies');

        this._renderMode();
    }

    _manageSelectedColony() {
        this._colonyManager.manageColony(this._coloniesList.selectedColony);
    }

    _renderMode() {
        let isEmpty = this.$domain.myState.colonies.length == 0;
        if (isEmpty) {
            this._coloniesList.toggle(false);
            this._colonyManager.toggle(false);
            this._noColoniesPlaceholderEl.classList.remove('g-hidden');
        } else {
            this._coloniesList.toggle(true);
            this._colonyManager.toggle(true);
            this._noColoniesPlaceholderEl.classList.add('g-hidden');
        }
    }

}

export {
    ColoniesTabView
}