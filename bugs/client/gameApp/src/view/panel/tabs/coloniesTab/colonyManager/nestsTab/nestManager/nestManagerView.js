import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nestManagerTmpl from './nestManagerTmpl.html';
import { TabSwitcher } from "@view/panel/base/tabSwitcher";
import { EggTabView } from "./eggTab/eggTabView";
import { LarvaTabView } from "./larvaTab/larvaTabView";
import { MainTabView } from "./mainTab/mainTabView";

class NestManagerView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._nest = null;

        this._render();

        this.$eventBus.on('tabSwitched', this._onSomeTabSwitched.bind(this));
    }

    manageNest(nest) {
        if (!nest) {
            return;
        }

        this._emitHideNestAreaRequest();
        this._nest = nest;
        this._emitShowNestAreaRequest();
        
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

    _emitHideNestAreaRequest() {
        if (this._nest) {
            this._nest.emit('hideNestAreaRequest');
        }
    }

    _emitShowNestAreaRequest() {
        if (this._nest) {
            this._nest.emit('showNestAreaRequest');
        }
    }

    _onSomeTabSwitched() {
        if (this.isVisible()) {
            this._emitShowNestAreaRequest();
        } else {
            this._emitHideNestAreaRequest();
        }
    }

}

export { NestManagerView }