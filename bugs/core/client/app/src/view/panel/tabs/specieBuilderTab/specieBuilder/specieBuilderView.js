import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import specieBuilderTmpl from './specieBuilderTmpl.html';
import { TabSwitcher } from "@view/panel/base/tabSwitcher";
import { ChromosomeEditorTab } from "./chromosomeEditorTabView";

class SpecieBuilderView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._specieBuilder = this.$domainFacade.specieBuilder

        this._render();
    }

    _render() {
        this._el.innerHTML = specieBuilderTmpl;

        this._bodyChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-body-chromosome-editor-tab]'));
        this._developmentChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-development-chromosome-editor-tab]'));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), [
            { name: 'body_editor', label: 'Тіло', tab: this._bodyChromosomeEditorTab },
            { name: 'development_editor', label: 'Розвиток', tab: this._developmentChromosomeEditorTab },
        ]);
    }

}

export {
    SpecieBuilderView
}