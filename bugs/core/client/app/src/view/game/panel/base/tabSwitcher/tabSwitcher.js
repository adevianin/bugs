import './styles.css';

import { BaseHTMLView } from '@view/base/baseHTMLView';

class TabSwitcher extends BaseHTMLView {

    //tabsData - [{ name: 'user', label: 'Користувач', tab: this._userTab }]
    constructor(el, tabsData) {
        super(el);
        this._tabsData = tabsData;
        
        this._render();

        this.activateTab(this._tabsData[0].name);
    }

    remove() {
        super.remove();
        for (let tabData of this._tabsData) {
            tabData.tab.remove();
        }
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
        this._tabsData.forEach(tabData => {
            tabData.tab.toggle(tabData.name == activatingTabName);
        });
        this._el.querySelectorAll('[data-tab-activator]').forEach(btn => {
            let activatorTabName = btn.getAttribute('data-tab-activator');
            btn.classList.toggle('tab-switcher__activator--active', activatorTabName == activatingTabName);
        });
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