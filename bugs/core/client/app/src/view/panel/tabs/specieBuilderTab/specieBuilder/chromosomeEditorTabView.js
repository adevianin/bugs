import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import chromosomeEditorTabTmpl from './chromosomeEditorTabTmpl.html';
import { SpecieGeneView } from "./specieGeneView";

class ChromosomeEditorTab extends BaseHTMLView {

    constructor(el, activatedSpecieGenesIds, specieGenes) {
        super(el);
        this._activatedSpecieGenesIds = activatedSpecieGenesIds;
        this._specieGenes = specieGenes;

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
        for (let specieGene of this._specieGenes) {
            this._renderSpecieGene(specieGene);
        }
    }

    _renderSpecieGene(specieGene) {
        let isActivated = this._checkIsActivated(specieGene);
        let el = document.createElement('li');
        let view = new SpecieGeneView(el, specieGene, isActivated);
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

    _checkIsActivated(specieGene) {
        let index = this._activatedSpecieGenesIds.indexOf(specieGene.id);
        return index >= 0;
    }
    
}

export {
    ChromosomeEditorTab
}