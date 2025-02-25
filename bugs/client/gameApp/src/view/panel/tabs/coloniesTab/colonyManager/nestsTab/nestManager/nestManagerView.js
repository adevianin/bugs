import { BaseHTMLView } from "@view/base/baseHTMLView";
import nestManagerTmpl from './nestManagerTmpl.html';
import { TabSwitcher } from "@view/panel/base/tabSwitcher";
import { EggTabView } from "./eggTab/eggTabView";
import { LarvaTabView } from "./larvaTab/larvaTabView";
import { MainTabView } from "./mainTab/mainTabView";

class NestManagerView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    manageNest(nest) {
        this._eggTab.manageNest(nest);
        this._larvaTab.manageNest(nest);
        this._mainTab.manageNest(nest);

        this._tabSwitcher.toggleTabDisabling('egg', !nest.isMain);
        this._tabSwitcher.toggleTabDisabling('larva', !nest.isMain);
        this._tabSwitcher.activateTab('main');
    }

    _render() {
        this._el.innerHTML = nestManagerTmpl;
        this._eggTab = new EggTabView(this._el.querySelector('[data-egg-tab]'));
        this._larvaTab = new LarvaTabView(this._el.querySelector('[data-larva-tab]'));
        this._mainTab = new MainTabView(this._el.querySelector('[data-main-tab]'));
        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), 'nest', [
            { name: 'main', label: 'основне', tab: this._mainTab },
            { name: 'egg', label: 'яйця', tab: this._eggTab },
            { name: 'larva', label: 'личинки', tab: this._larvaTab }
        ]);
    }

}

export { NestManagerView }