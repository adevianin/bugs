import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nestManagerTmpl from './nestManagerTmpl.html';
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

        let newNest = nest;
        let prevNest = this._nest;
        this._nest = nest;
        this._showNest(newNest, prevNest);
        
        this._mainTab.manageNest(nest);
        this._larvaTab.manageNest(nest);
        this._eggTab.manageNest(nest);

        this._larvaTab.toggle(nest.isMain);
        this._eggTab.toggle(nest.isMain);
    }

    showCurrentNest() {
        this._showNest(this._nest, this._nest);
    }

    _render() {
        this._el.innerHTML = nestManagerTmpl;
        this._el.classList.add('nest-manager');
        this._eggTab = new EggTabView(this._el.querySelector('[data-egg-tab]'));
        this._larvaTab = new LarvaTabView(this._el.querySelector('[data-larva-tab]'));
        this._mainTab = new MainTabView(this._el.querySelector('[data-main-tab]'));
    }

    _emitHideNestAreaRequest() {
        this.$eventBus.emit(`hideNestAreaRequest`);
    }

    _emitShowNestAreaRequest() {
        if (this._nest) {
            this.$eventBus.emit(`showNestAreaRequest:${this._nest.id}`);
        }
    }

    _onSomeTabSwitched() {
        if (this.isVisible()) {
            this._emitShowNestAreaRequest();
        } else {
            this._emitHideNestAreaRequest();
        }
    }

    _showNest(newNest, prevNest) {
        if (prevNest && prevNest.isDied) {
            return
        }
        let isFirstNestShow = !prevNest;
        this.$eventBus.emit('showPointRequest', newNest.position, isFirstNestShow);
        if (!isFirstNestShow) {
            this._emitHideNestAreaRequest();
            this._emitShowNestAreaRequest();
            setTimeout(() => {
                this._emitShowNestAreaRequest();
            }, 600);// delay needed if nest is another chunk;
        }
    }

}

export { NestManagerView }