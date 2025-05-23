import './style.css';
import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import tabHeadTmpl from './tabHeadTmpl.html';
import { HelpCallerView } from '@view/panel/helpCaller/helpCallerView';

class PanelTabHeadView extends BaseGameHTMLView {

    constructor(el, tabName, helpSectionId) {
        super(el);
        this._tabName = tabName;
        this._helpSectionId = helpSectionId;

        this._render();
    }

    _render() {
        this._el.innerHTML = tabHeadTmpl;
        this._el.classList.add('panel-tab-head');

        this._el.querySelector('[data-tab-label-name]').innerHTML = this._tabName;

        let helpSignEl = this._el.querySelector('[data-help-sign]');
        if (this._helpSectionId) {
            this._helpSignView = new HelpCallerView(helpSignEl, this._helpSectionId);
        } else {
            helpSignEl.remove();
        }

    }
}

export {
    PanelTabHeadView
}