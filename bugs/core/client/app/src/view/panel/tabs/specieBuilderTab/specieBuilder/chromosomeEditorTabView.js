import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import chromosomeEditorTabTmpl from './chromosomeEditorTabTmpl.html';

class ChromosomeEditorTab extends BaseHTMLView {

    constructor(el, chromosomeSchema, geneEntries) {
        super(el);
        this._chromosomeSchema = chromosomeSchema;
        this._geneEntries = geneEntries;

        this._render();
    }

    _render() {
        this._el.innerHTML = chromosomeEditorTabTmpl;
    }

    
}

export {
    ChromosomeEditorTab
}