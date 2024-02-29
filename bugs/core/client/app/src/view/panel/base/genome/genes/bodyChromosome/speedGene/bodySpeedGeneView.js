import { GeneView } from "../../base/geneView";
import bodySpeedTmpl from './bodySpeedTmpl.html';

class BodySpeedGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = bodySpeedTmpl;
        el.querySelector('[data-speed]').innerHTML = this._gene.speed;
    }

}

export {
    BodySpeedGeneView
}