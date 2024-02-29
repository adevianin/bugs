import { GeneView } from "../base/geneView";

class AdjustingDevelopmentAppetiteGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = 'ген підстройки апетиту розвитку';
    }
}

export {
    AdjustingDevelopmentAppetiteGeneView
}