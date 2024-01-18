import './styles.css';
import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import colonyManagerTmpl from "./colonyManagerTmpl.html";
import { NestsTabView } from './nestsTab';
import { AntsTab } from './antsTab';
import { OperationsTab } from './operationsTab';
import { TabSwitcher } from '@view/panel/base/tabSwitcher';

class ColonyManager extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    manageColony(colony){
        this._colony = colony;
        this._colonyNameEl.innerHTML = `colony: ${this._colony.id}`;
        this._nestsTab.manageColony(colony);
        this._operationsTab.manageColony(colony);
        this._antsTab.manageColony(colony);
    }

    showNestManagerFor(nest) {
        this._tabSwitcher.activateTab('nests');
        this._nestsTab.showNestManagerFor(nest);
    }

    _render() {
        this._el.innerHTML = colonyManagerTmpl;
        this._colonyNameEl = this._el.querySelector('[data-colony-name]');
        this._antsTab = new AntsTab(this._el.querySelector('[data-ants-tab]'));
        this._operationsTab = new OperationsTab(this._el.querySelector('[data-operations-tab]'));
        this._nestsTab = new NestsTabView(this._el.querySelector('[data-nests-tab]'));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), [
            { name: 'ants', label: 'мурахи', tab: this._antsTab },
            { name: 'operations', label: 'операції', tab: this._operationsTab },
            { name: 'nests', label: 'гнізда', tab: this._nestsTab }
        ]);
    }
}

export { ColonyManager }