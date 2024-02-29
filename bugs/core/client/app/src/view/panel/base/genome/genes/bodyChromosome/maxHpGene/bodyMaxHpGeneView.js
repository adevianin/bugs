import { GeneView } from "../../base/geneView";
import bodyMaxHpTmpl from './bodyMaxHpTmpl.html';

class BodyMaxHpGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = bodyMaxHpTmpl;
        el.querySelector('[data-max-hp]').innerHTML = this._gene.maxHp;
    }

}

export {
    BodyMaxHpGeneView
}