import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import specieBuilderTabTmpl from './specieBuilderTabTmpl.html';
import { SpecieBuilderView } from "./specieBuilder/specieBuilderView";

import './styles.css';

class SpecieBuilderTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    remove() {
        super.remove();
        this._specieBuilderView.remove();
    }

    _render() {
        this._el.innerHTML = specieBuilderTabTmpl;

        this._specieBuilderView = new SpecieBuilderView(this._el.querySelector('[data-specie-builder]'));
    }

}

export {
    SpecieBuilderTabView
}