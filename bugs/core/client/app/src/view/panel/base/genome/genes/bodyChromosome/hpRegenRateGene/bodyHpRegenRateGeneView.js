import { GeneView } from "../../base/geneView";
import bodyHpRegenRateTmpl from './bodyHpRegenRateTmpl.html';

class BodyHpRegenRateGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = bodyHpRegenRateTmpl;
        el.querySelector('[data-hp-regen-rate]').innerHTML = this._gene.hpRegenRate;
    }

}

export {
    BodyHpRegenRateGeneView
}