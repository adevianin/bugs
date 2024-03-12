import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import specieBuilderTmpl from './specieBuilderTmpl.html';

class SpecieBuilderView extends BaseHTMLView {

    constructor(el, specieBuilder) {
        super(el);

        this._specieBuilder = specieBuilder;

        this._render();
    }

    _render() {
        this._el.innerHTML = specieBuilderTmpl;
    }

}

export {
    SpecieBuilderView
}