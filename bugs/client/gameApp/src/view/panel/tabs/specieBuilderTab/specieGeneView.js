import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import specieGeneTmpl from './specieGeneTmpl.html';
import { GeneView } from "../../base/genome/genes/geneView";
import { CONSTS } from "@domain/consts";

class SpecieGeneView extends BaseGameHTMLView {

    constructor(el, specieGene, isActivated, chromosomeType) {
        super(el);
        this._specieGene = specieGene;
        this._isActivated = isActivated;
        this._chromosomeType = chromosomeType;

        this._render();

        this._activateBtn.addEventListener('click', this._onActivateBtnClick.bind(this));
        this._deactivateBtn.addEventListener('click', this._onDeactivateBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = specieGeneTmpl;
        this._geneView = new GeneView(this._el.querySelector('[data-gene]'), this._specieGene.gene);
        this._activateBtn = this._el.querySelector('[data-activate-btn]');
        this._deactivateBtn = this._el.querySelector('[data-deactivate-btn]');
        this._toggleActivationBtn(!this._isActivated);
        let isRequired = CONSTS.REQUIRED_GENES[this._chromosomeType].includes(this._specieGene.gene.type)
        this._toggleDeactivationBtn(this._isActivated && !isRequired);
    }

    remove() {
        super.remove();
        this._geneView.remove();
    }

    _toggleActivationBtn(isActive) {
        this._activateBtn.classList.toggle('g-hidden', !isActive);
    }

    _toggleDeactivationBtn(isActive) {
        this._deactivateBtn.classList.toggle('g-hidden', !isActive);
    }

    _onActivateBtnClick() {
        this.events.emit('actiovationGene', this._specieGene);
    }

    _onDeactivateBtnClick() {
        this.events.emit('deactiovationGene', this._specieGene);
    }
}

export {
    SpecieGeneView
}