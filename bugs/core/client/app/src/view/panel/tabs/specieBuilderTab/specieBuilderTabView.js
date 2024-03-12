import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import specieBuilderTabTmpl from './specieBuilderTabTmpl.html';
import { SpecieBuilderView } from "./specieBuilder/specieBuilderView";

class SpecieBuilderTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._specieBuilder = this.$domainFacade.specieBuilder;
        this._specieBuilder.on('loadingStart', this._onLoadingStart.bind(this))
        this._specieBuilder.on('loadingEnd', this._onLoadingEnd.bind(this))
    }

    toggle(isEnabled) {
        super.toggle(isEnabled);
        if (isEnabled) {
            this._specieBuilder.load()
        }
    }

    _render() {
        this._el.innerHTML = specieBuilderTabTmpl;

        this._loaderEl = this._el.querySelector('[data-loader]');
        this._specieBuilderView = new SpecieBuilderView(this._el.querySelector('[data-specie-builder]'), this._specieBuilder);
    }

    _toggleLoadingState(isLoading) {
        this._loaderEl.classList.toggle('hidden', !isLoading);
        this._specieBuilderView.toggle(!isLoading);
    }

    _onLoadingStart() {
        this._toggleLoadingState(true);
    }

    _onLoadingEnd() {
        this._toggleLoadingState(false);
    }

}

export {
    SpecieBuilderTabView
}