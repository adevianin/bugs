import { BaseHTMLView } from "@view/base/baseHTMLView";
import specieGeneTmpl from './specieGeneTmpl.html';
import { GeneView } from "../../base/genome/genes/geneView";

class SpecieGeneView extends BaseHTMLView {

    constructor(el, specieGene, isActivated) {
        super(el);
        this._specieGene = specieGene;
        this._isActivated = isActivated;

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
        this._toggleDeactivationBtn(this._isActivated && !this._specieGene.isRequired);
    }

    remove() {
        super.remove();
        this._geneView.remove();
    }

    _toggleActivationBtn(isActive) {
        this._activateBtn.classList.toggle('hidden', !isActive);
    }

    _toggleDeactivationBtn(isActive) {
        this._deactivateBtn.classList.toggle('hidden', !isActive);
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