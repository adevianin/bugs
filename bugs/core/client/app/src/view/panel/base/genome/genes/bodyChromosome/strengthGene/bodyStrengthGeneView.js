import { GeneView } from "../../base/geneView";
import bodyStrengthTmpl from './bodyStrengthTmpl.html';

class BodyStrengthGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = bodyStrengthTmpl;
        el.querySelector('[data-strength]').innerHTML = this._gene.strength;
    }

}

export {
    BodyStrengthGeneView
}