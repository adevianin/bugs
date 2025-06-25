import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import coloniesTabTmpl from "./coloniesTab.html";
import { ColonyManager } from './colonyManager';
import { ColoniesSelectView } from './coloniesSelect/coloniesSelectView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { PanelTabHeadView } from '@view/panel/panelTabHead/panelTabHeadView';
import '@view/panel/icons/queenIcon.png';

class ColoniesTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        
        this._render();

        this._coloniesList.events.on('selectedColonyChanged', this._manageSelectedColony.bind(this));
        this.$domain.myState.on('colonyBorn', this._renderMode.bind(this));
        this.$domain.myState.on('colonyDied', this._renderMode.bind(this));
        this._showColonyBtn.addEventListener('click', this._onShowColonyClick.bind(this));
    }

    showNestManagerFor(nest){
        this._coloniesList.selectColony(nest.fromColony);
        this._colonyManager.manageColony(this._coloniesList.selectedColony, nest);
    }

    _render() {
        this._el.innerHTML = coloniesTabTmpl;

        this._noColoniesPlaceholderEl = this._el.querySelector('[data-no-colonies-space-holder]');
        this._noColoniesPlaceholderEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.COLONIES_TAB_LABEL_NO_COLONIES);

        this._coloniesList = new ColoniesSelectView(this._el.querySelector('[data-colonies-select]'));
        this._colonyManager = new ColonyManager(this._el.querySelector('[data-colony-manager]'));

        this._showColonyBtn = this._el.querySelector('[data-show-colony-btn]');
        this._showColonyBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.COLONIES_TAB_SHOW_COLONY_BTN);

        this._colonySelectorEl = this._el.querySelector('[data-colony-selector]');

        let tabName = this.$mm.get(GAME_MESSAGE_IDS.COLONIES_TAB_TITLE);
        this._tabHeadView = new PanelTabHeadView(this._el.querySelector('[data-tab-head]'), tabName, 'colonies');

        this._el.querySelector('[data-colony-selector-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.COLONIES_TAB_LABEL_COLONY_SELECTOR);

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
            this._colonySelectorEl.classList.add('g-hidden');
        } else {
            this._coloniesList.toggle(true);
            this._colonyManager.toggle(true);
            this._noColoniesPlaceholderEl.classList.add('g-hidden');
            this._colonySelectorEl.classList.remove('g-hidden');
        }
    }

    _onShowColonyClick() {
        let nests = this.$domain.myState.getNestsFromColony(this._coloniesList.selectedColony.id);
        let xSum = 0;
        let ySum = 0;
        for (let nest of nests) {
            xSum += nest.position.x;
            ySum += nest.position.y;
        }

        let x = parseInt(xSum / nests.length);
        let y = parseInt(ySum / nests.length);

        this.$eventBus.emit('showPointRequest', {x,y});
    }

}

export {
    ColoniesTabView
}