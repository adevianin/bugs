import { GeneView } from "../../base/geneView";
import bodyDefenseTmpl from './bodyDefenseTmpl.html';

class BodyDefenseGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = bodyDefenseTmpl;
        el.querySelector('[data-defense]').innerHTML = this._gene.defense;
    }

}

export {
    BodyDefenseGeneView
}