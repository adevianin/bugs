import './styles.css';

import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';

class TabSwitcher extends BaseGameHTMLView {

    //tabsData - [{ name: 'user', label: 'Користувач', tab: this._userTab }]
    constructor(el, switcherName, tabsData) {
        super(el);
        this._tabsData = tabsData;
        this._switcherName = switcherName;
        this._currentActiveTabName = null;
        
        this._render();

        this.activateTab(this._tabsData[0].name);
    }

    remove() {
        super.remove();
        for (let tabData of this._tabsData) {
            tabData.tab.remove();
        }
    }

    getActivatorForTab(tabName) {
        return this._el.querySelector(`[data-tab-activator="${tabName}"]`);
    }

    _render() {
        this._tabsData.forEach(tabData => {
            let btn = document.createElement('button');
            btn.setAttribute('data-tab-activator', tabData.name);
            btn.innerHTML = tabData.label;
            btn.classList.add('tab-switcher__activator');
            this._el.append(btn);
            btn.addEventListener('click', this._onTabActivatorClick.bind(this));
        });
    }

    activateTab(activatingTabName) {
        if (this._currentActiveTabName == activatingTabName) {
            return
        }
        this._tabsData.forEach(tabData => {
            tabData.tab.toggle(tabData.name == activatingTabName);
        });
        this._el.querySelectorAll('[data-tab-activator]').forEach(btn => {
            let activatorTabName = btn.getAttribute('data-tab-activator');
            btn.classList.toggle('tab-switcher__activator--active', activatorTabName == activatingTabName);
        });
        this._currentActiveTabName = activatingTabName;
        this.$eventBus.emit(`tabSwitched:${this._switcherName}`, activatingTabName);
        this.$eventBus.emit('tabSwitched', this._switcherName, activatingTabName);
    }

    toggleTabDisabling(tabName, isDisabled) {
        this._el.querySelector(`[data-tab-activator="${tabName}"]`).disabled = isDisabled;
    }

    _onTabActivatorClick(event) {
        let btn = event.target;
        let tabName = btn.getAttribute('data-tab-activator');
        this.activateTab(tabName);
    }

}

export {
    TabSwitcher
}