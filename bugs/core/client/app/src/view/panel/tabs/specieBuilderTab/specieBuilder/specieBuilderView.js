import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import specieBuilderTmpl from './specieBuilderTmpl.html';
import { TabSwitcher } from "@view/panel/base/tabSwitcher";
import { ChromosomeEditorTab } from "./chromosomeEditorTabView";

class SpecieBuilderView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = specieBuilderTmpl;

        let specieChromosome;
        let el;

        // specieChromosome = this.$domainFacade.specie.chromosomes.body;
        // el = this._el.querySelector('[data-body-chromosome-editor-tab]');
        // this._bodyChromosomeEditorTab = new ChromosomeEditorTab(el, specieChromosome.activatedGenesIds, specieChromosome.genes);

        // specieChromosome = this.$domainFacade.specie.chromosomes.development;
        // el = this._el.querySelector('[data-development-chromosome-editor-tab]');
        // this._developmentChromosomeEditorTab = new ChromosomeEditorTab(el, specieChromosome.activatedGenesIds, specieChromosome.genes);

        // this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), [
        //     { name: 'body_editor', label: 'Тіло', tab: this._bodyChromosomeEditorTab },
        //     { name: 'development_editor', label: 'Розвиток', tab: this._developmentChromosomeEditorTab },
        // ]);
    }

    _buildChromosomeEditorTab(el, specieChromosome) {
        return 
    }

}

export {
    SpecieBuilderView
}