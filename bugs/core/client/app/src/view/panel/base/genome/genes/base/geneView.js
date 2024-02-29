import { BaseHTMLView } from "../../../baseHTMLView";
import geneTmpl from './geneTmpl.html';

class GeneView extends BaseHTMLView {

    constructor (el, gene) {
        super(el);
        this._gene = gene;

        this._render();
    }

    _render() {
        this._el.innerHTML = geneTmpl;

        this._el.querySelector('[data-domination-code]').innerHTML = this._gene.dominationCode;
        this._renderGene(this._el.querySelector('[data-gene]'));
    }

    _renderGene(el) {
        throw 'abstract method';
    }
}

export {
    GeneView
}