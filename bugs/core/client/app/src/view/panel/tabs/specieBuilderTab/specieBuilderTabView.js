import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import specieBuilderTabTmpl from './specieBuilderTabTmpl.html';
import { SpecieBuilderView } from "./specieBuilder/specieBuilderView";

import './styles.css';

class SpecieBuilderTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
        this._toggleLoader(true);

        let specie = this.$domainFacade.getMySpecie();
        console.log(specie);
    }

    _onSpecieBuilderInited() {
        this._toggleLoader(false);
        this._specieBuilderView = new SpecieBuilderView(this._specieBuilderEl);
    }

    _render() {
        this._el.innerHTML = specieBuilderTabTmpl;

        this._loaderEl = this._el.querySelector('[data-loader]');
        this._specieBuilderEl = this._el.querySelector('[data-specie-builder]');
    }

    _toggleLoader(isLoading) {
        this._loaderEl.classList.toggle('hidden', !isLoading);
    }

}

export {
    SpecieBuilderTabView
}