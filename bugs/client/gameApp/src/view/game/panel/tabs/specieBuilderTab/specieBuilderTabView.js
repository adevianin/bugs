import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import specieBuilderTabTmpl from './specieBuilderTabTmpl.html';
import { ChromosomeEditorTab } from "./chromosomeEditorTabView";
import { TabSwitcher } from '../../base/tabSwitcher';
import { ChromosomesTypes } from "@domain/enum/chromosomeTypes";

class SpecieBuilderTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._specie = this.$domainFacade.getMySpecie();

        this._render();
    }

    _render() {
        this._el.innerHTML = specieBuilderTabTmpl;

        this._bodyChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-body-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.BODY));
        this._developmentChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-development-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.DEVELOPMENT));
        this._adaptationChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-adaptation-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.ADAPTATION));
        this._buildingChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-building-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.BUILDING));
        this._combatChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-combat-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.COMBAT));
        this._adjustingChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-adjusting-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.ADJUSTING));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), 'specie', [
            { name: 'body_editor', label: 'Тіло', tab: this._bodyChromosomeEditorTab },
            { name: 'development_editor', label: 'Розвиток', tab: this._developmentChromosomeEditorTab },
            { name: 'adaptation_editor', label: 'Адаптація', tab: this._adaptationChromosomeEditorTab },
            { name: 'building_editor', label: 'Будівництво', tab: this._buildingChromosomeEditorTab },
            { name: 'combat_editor', label: 'Бій', tab: this._combatChromosomeEditorTab },
            { name: 'adjusting_editor', label: 'Підстройка', tab: this._adjustingChromosomeEditorTab },
        ]);
    }

}

export {
    SpecieBuilderTabView
}