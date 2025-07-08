import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import chromosomeEditorTabTmpl from './chromosomeEditorTabTmpl.html';
import { SpecieGeneView } from "./specieGeneView";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { GenesTypes } from '@domain/enum/genesTypes';

class ChromosomeEditorTab extends BaseGameHTMLView {

    constructor(el, chromosome) {
        super(el);
        this._chromosome = chromosome;

        let genesOrder = Object.values(GenesTypes);
        this._genesOrderMap = new Map(genesOrder.map((type, index) => [type, index]));

        this._chromosome.on('specieGeneActiveStatusChanged', this._onSpecieGeneActiveStatusChanged.bind(this));
        this._chromosome.on('specieGenesUpdated', this._onSpecieGenesUpdated.bind(this));
        this._chromosome.on('geneActivationDone', this._onGeneActivationDone.bind(this));

        this._specieGeneViews = {};

        this._render();
    }

    _render() {
        this._el.innerHTML = chromosomeEditorTabTmpl;

        this._specieGenesListEl = this._el.querySelector('[data-specie-genes-list]');
        this._activatedSpecieGenesListEl = this._el.querySelector('[data-activated-specie-genes-list]');

        this._el.querySelector('[data-activated-genes-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.SPECIE_BUILDER_ACTIVATED_GENES_TITLE);
        this._el.querySelector('[data-not-activated-genes-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.SPECIE_BUILDER_NOT_ACTIVATED_GENES_TITLE);
        
        this._renderSpecieGenesList();
        this._sortActivatedGenes();
    }

    _renderSpecieGenesList() {
        let specieGenes = this._chromosome.specieGenes;
        specieGenes.sort(() => Math.random() - 0.5);
        for (let specieGene of specieGenes) {
            this._renderSpecieGene(specieGene);
        }
    }

    _renderSpecieGene(specieGene) {
        let isActivated = this._chromosome.checkIsGeneActivated(specieGene.id);
        let el = document.createElement('div');
        let view = new SpecieGeneView(el, specieGene, isActivated, this._chromosome.type);
        view.events.on('actiovationGene', this._onActivationGene.bind(this));
        view.events.on('deactiovationGene', this._onDeactivationGene.bind(this));
        this._specieGeneViews[specieGene.id] = view;
        if (isActivated) {
            this._activatedSpecieGenesListEl.append(el);
        } else {
            this._specieGenesListEl.append(el);
        }
        
    }

    _clearSpecieGenesList() {
        for (let specieGeneId in this._specieGeneViews) {
            this._specieGeneViews[specieGeneId].remove();
        }

        this._specieGeneViews = {};
    }

    _sortActivatedGenes() {
        let activatedSpecieGenes = this._chromosome.getActivatedSpecieGenes();
        activatedSpecieGenes.sort((a, b) => {
            return this._genesOrderMap.get(a.gene.type) - this._genesOrderMap.get(b.gene.type);
        });
        this._activatedSpecieGenesListEl.innerHTML = '';
        for (let specieGene of activatedSpecieGenes) {
            this._activatedSpecieGenesListEl.append(this._specieGeneViews[specieGene.id].el);
        }
    }

    _onActivationGene(specieGene) {
        this._chromosome.activateSpecieGene(specieGene);
    }

    _onDeactivationGene(specieGene) {
        this._chromosome.deactivateSpecieGene(specieGene);
    }

    _onSpecieGeneActiveStatusChanged(specieGene) {
        this._specieGeneViews[specieGene.id].remove();
        delete this._specieGeneViews[specieGene.id];
        this._renderSpecieGene(specieGene);
    }

    _onSpecieGenesUpdated() {
        this._clearSpecieGenesList();
        this._renderSpecieGenesList();
        this._sortActivatedGenes();
    }

    _onGeneActivationDone() {
        this._sortActivatedGenes();
    }

}

export {
    ChromosomeEditorTab
}