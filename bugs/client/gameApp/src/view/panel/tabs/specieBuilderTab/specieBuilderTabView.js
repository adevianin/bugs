import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import specieBuilderTabTmpl from './specieBuilderTabTmpl.html';
import { ChromosomeEditorTab } from "./chromosomeEditorTabView";
import { TabSwitcher } from '../../base/tabSwitcher';
import { ChromosomesTypes } from "@domain/enum/chromosomeTypes";
import { HelpCallerView } from '@view/panel/helpCaller/helpCallerView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class SpecieBuilderTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._specie = this.$domain.myState.nuptialEnvironment.specie;

        this._specie.on('specieSchemaChanged', this._onSpecieSchemaChanged.bind(this));

        this._render();
    }

    _render() {
        this._el.innerHTML = specieBuilderTabTmpl;

        this._bodyChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-body-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.BODY));
        this._developmentChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-development-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.DEVELOPMENT));
        this._adaptationChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-adaptation-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.ADAPTATION));
        this._specializationChromosomeEditorTab = new ChromosomeEditorTab(this._el.querySelector('[data-specialization-chromosome-editor-tab]'), this._specie.getChromosomeByType(ChromosomesTypes.SPECIALIZATION));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), 'specie', [
            { name: 'body_editor', label: this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_BODY), tab: this._bodyChromosomeEditorTab },
            { name: 'development_editor', label: this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_DEVELOPMENT), tab: this._developmentChromosomeEditorTab },
            { name: 'adaptation_editor', label: this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_ADAPTATION), tab: this._adaptationChromosomeEditorTab },
            { name: 'specialization_editor', label: this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_SPECIALIZATION), tab: this._specializationChromosomeEditorTab }
        ]);
        this._helpCallerBreeding = new HelpCallerView(this._el.querySelector('[data-help-sign]'), 'specie');
        this._el.querySelector('[data-tab-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.SPECIE_BUILDER_TAB_TITLE);
    }

    _onSpecieSchemaChanged() {
        this.$domain.saveSpecieSchema();
    }

}

export {
    SpecieBuilderTabView
}