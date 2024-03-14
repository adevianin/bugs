import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import specieBuilderTmpl from './specieBuilderTmpl.html';
import { TabSwitcher } from "@view/panel/base/tabSwitcher";
import { ChromosomeEditorTab } from "./chromosomeEditorTabView";

class SpecieBuilderView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._specie = this.$domainFacade.getMySpecie();

        this._render();
    }

    _render() {
        this._el.innerHTML = specieBuilderTmpl;

        this._bodyChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-body-chromosome-editor-tab]'), this._specie.bodyChromosome);
        this._developmentChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-development-chromosome-editor-tab]'), this._specie.developmentChromosome);
        this._adaptationChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-adaptation-chromosome-editor-tab]'), this._specie.adaptationChromosome);
        this._buildingChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-building-chromosome-editor-tab]'), this._specie.buildingChromosome);
        this._combatChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-combat-chromosome-editor-tab]'), this._specie.combatChromosome);
        this._adjustingChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-adjusting-chromosome-editor-tab]'), this._specie.adjustingChromosome);

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), [
            { name: 'body_editor', label: 'Тіло', tab: this._bodyChromosomeEditorTab },
            { name: 'development_editor', label: 'Розвиток', tab: this._developmentChromosomeEditorTab },
            { name: 'adaptation_editor', label: 'Адаптація', tab: this._adaptationChromosomeEditorTab },
            { name: 'building_editor', label: 'Будівництво', tab: this._buildingChromosomeEditorTab },
            { name: 'combat_editor', label: 'Бій', tab: this._combatChromosomeEditorTab },
            { name: 'adjusting_editor', label: 'Підстройка', tab: this._adjustingChromosomeEditorTab },
        ]);
    }

    _buildChromosomeEditorTab(el, specieChromosome) {
        return 
    }

}

export {
    SpecieBuilderView
}