import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import chromosomeEditorTabTmpl from './chromosomeEditorTabTmpl.html';
import { SpecieGeneView } from "./specieGeneView";

class ChromosomeEditorTab extends BaseGameHTMLView {

    constructor(el, chromosome) {
        super(el);
        this._chromosome = chromosome;

        this._chromosome.on('specieGeneActiveStatusChanged', this._onSpecieGeneActiveStatusChanged.bind(this));
        this._chromosome.on('specieGenesUpdated', this._onSpecieGenesUpdated.bind(this));

        this._specieGeneViews = {};

        this._render();
    }

    _render() {
        this._el.innerHTML = chromosomeEditorTabTmpl;

        this._specieGenesListEl = this._el.querySelector('[data-specie-genes-list]');
        this._activatedSpecieGenesListEl = this._el.querySelector('[data-activated-specie-genes-list]');
        
        this._renderSpecieGenesList();
    }

    _renderSpecieGenesList() {
        for (let specieGene of this._chromosome.specieGenes) {
            this._renderSpecieGene(specieGene);
        }
    }

    _renderSpecieGene(specieGene) {
        let isActivated = this._chromosome.checkIsGeneActivated(specieGene.id);
        let el = document.createElement('li');
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
    }

}

export {
    ChromosomeEditorTab
}