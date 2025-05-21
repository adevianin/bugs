import './style.css';
import dotsLoaderTmpl from './dotsLoaderTmpl.html';
import { BaseHTMLView } from "../base/baseHTMLView";

class DotsLoaderView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = dotsLoaderTmpl;
        this._el.classList.add('dots-loader', 'g-not-visible');
    }

    toggleVisibility(isVisible) {
        this._el.classList.toggle('g-not-visible', !isVisible);
    }
    
}

export {
    DotsLoaderView
}