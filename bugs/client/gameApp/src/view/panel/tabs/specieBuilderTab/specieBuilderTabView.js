import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import specieBuilderTabTmpl from './specieBuilderTabTmpl.html';
import { ChromosomeEditorTab } from "./chromosomeEditorTabView";
import { TabSwitcher } from '../../base/tabSwitcher';
import { ChromosomesTypes } from "@domain/enum/chromosomeTypes";
import { HelpCallerView } from '@view/panel/helpCaller/helpCallerView';

class SpecieBuilderTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._specie = this.$domain.getMySpecie();

        this._render();
    }

    _render() {
        this._el.innerHTML = specieBuilderTabTmpl;

        this._bodyChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-body-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.BODY));
        this._developmentChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-development-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.DEVELOPMENT));
        this._adaptationChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-adaptation-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.ADAPTATION));
        this._specializationChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-specialization-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.SPECIALIZATION));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), 'specie', [
            { name: 'body_editor', label: 'Тіло', tab: this._bodyChromosomeEditorTab },
            { name: 'development_editor', label: 'Розвиток', tab: this._developmentChromosomeEditorTab },
            { name: 'adaptation_editor', label: 'Адаптація', tab: this._adaptationChromosomeEditorTab },
            { name: 'specialization_editor', label: 'Спеціалізація', tab: this._specializationChromosomeEditorTab }
        ]);
        this._helpCallerBreeding = new HelpCallerView(this._el.querySelector('[data-help-sign]'), 'specie');
    }

}

export {
    SpecieBuilderTabView
}