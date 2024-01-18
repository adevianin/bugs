import { BaseHTMLView } from "../baseHTMLView";
import genesTmpl from './genesTmpl.html';

class GenesView extends BaseHTMLView {

    constructor(el, genes) {
        super(el);
        this._genes = genes;

        this._render();
    }

    _render() {
        this._el.innerHTML = genesTmpl;
    }
}

export {
    GenesView
}