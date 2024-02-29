import { GeneView } from "../base/geneView";

class AdjustingAppetiteGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = 'ген підстройки апетиту';
    }
}

export {
    AdjustingAppetiteGeneView
}