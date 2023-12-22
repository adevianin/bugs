import { BaseHTMLView } from "@view/base/baseHTMLView";
import antsTabTmpl from './antsTabTmpl.html';

class AntsTab extends BaseHTMLView {

    constructor(el) {
        super(el)

        this._render();
    }

    _render() {
        this._el.innerHTML = antsTabTmpl;
    }
}

export { AntsTab }