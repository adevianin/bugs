import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import colonyManagerTmpl from "./colonyManagerTmpl.html";
import { NestsTabView } from './nestsTab';
import { AntsTab } from './antsTab';
import { OperationsTab } from './operationsTab';
import { EnemiesTab } from './enemiesTab';
import { TabSwitcher } from '@view/panel/base/tabSwitcher';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class ColonyManager extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    manageColony(colony, nestToSelect){
        if (!colony) {
            return 
        }
        
        this._colony = colony;
        this._operationsTab.manageColony(colony);
        this._antsTab.manageColony(colony);
        this._nestsTab.manageColony(colony, nestToSelect);
        this._enemiesTab.manageColony(colony);
        if (nestToSelect) {
            this._tabSwitcher.activateTab('nests');
        }
    }

    _render() {
        this._el.innerHTML = colonyManagerTmpl;
        this._el.classList.add('colony_manager');
        this._antsTab = new AntsTab(this._el.querySelector('[data-ants-tab]'));
        this._operationsTab = new OperationsTab(this._el.querySelector('[data-operations-tab]'));
        this._nestsTab = new NestsTabView(this._el.querySelector('[data-nests-tab]'));
        this._enemiesTab = new EnemiesTab(this._el.querySelector('[data-enemies-tab]'));

        let antsTabName = this.$mm.get(GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_ANTS);
        let operationsTabName = this.$mm.get(GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_OPERATIONS);
        let nestsTabName = this.$mm.get(GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_NESTS);
        let enemiesTabName = this.$mm.get(GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_ENEMIES);

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), 'colony', [
            { name: 'ants', label: antsTabName, tab: this._antsTab },
            { name: 'operations', label: operationsTabName, tab: this._operationsTab },
            { name: 'nests', label: nestsTabName, tab: this._nestsTab },
            { name: 'enemies', label: enemiesTabName, tab: this._enemiesTab }
        ]);
    }
}

export { ColonyManager }