import { GeneView } from "../../base/geneView";
import bodySightDistanceTmpl from './bodySightDistanceTmpl.html';

class BodySightDistanceGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = bodySightDistanceTmpl;
        el.querySelector('[data-sight-distance]').innerHTML = this._gene.sightDistance;
    }

}

export {
    BodySightDistanceGeneView
}